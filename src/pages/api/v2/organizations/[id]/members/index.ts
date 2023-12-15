import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Organization, OrganizationMember, User, UserNotification } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { uuid as uuidv4 } from 'uuidv4';

const projection = { apiKeys: 0 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get API key from request header
  // const apiKey = req.headers['Authorization'];
  // if (!apiKey) return res.status(401).json({ message: 'Unauthorized.' });

  // get organization ID from request query
  const { id } = req.query;

  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB as string);

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  // check if user is a member of the organization
  const organization = (await db.collection('organizations').findOne(
    { id },
    {
      projection: {
        id: 1,
        name: 1,
        description: 1,
        avatar: 1,
        members: 1,
        statistics: 1,
        updatedAt: 1,
        createdAt: 1,
        updatedById: 1,
        updatedBy: 1,
        ownerId: 1
      }
    }
  )) as Organization | null;
  if (!organization) return res.status(404).json({ message: 'Organization not found.' });
  if (!Object.values(organization.members).find((item) => item.id === uid))
    return res.status(403).json({ message: 'Forbidden.' });

  if (req.method === 'GET') {
    let members = organization.members;
    for (const key of Object.keys(members)) {
      let member = members[key];
      if (member?.type === 'user' || !member?.type) {
        // fetch user data
        const user = (await db.collection('users').findOne(
          { id: member?.id || key },
          {
            projection: {
              displayName: 1,
              username: 1,
              avatar: 1
            }
          }
        )) as User | null;
        if (user) {
          member = {
            ...member,
            ...user
          } as OrganizationMember;
          members[key] = member;
        }
      }
    }

    return res.status(200).json(Object.values(members));
  }

  if (req.method === 'POST') {
    const { type, robloxId, userId } = req.body;
    switch (type) {
      case 'user':
        // check if user exists
        const user = (await db.collection('users').findOne({ id: userId })) as User | null;
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // check if user is already a member
        if (Object.values(organization.members).find((item) => item.id === userId))
          return res.status(400).json({ message: 'User is already a member.' });

        // add user to organization
        const uuid = uuidv4();
        const data: OrganizationMember = {
          type: 'user',
          uuid: uuid,
          id: userId,

          role: 1,
          accessGroups: [],
          scanData: {},

          joined: false, // invitee
          createdAt: null,
          updatedAt: null
        };

        await db.collection('organizations').updateOne({ id }, { $set: { [`members.${uuid}`]: data } });

        // append notification
        const notificationId = uuidv4();
        const notificationData = {
          id: notificationId,
          recipientId: userId,
          senderId: uid,
          read: false,
          type: 'organization-invitation',
          title: 'Organization Invitation',
          description: null,
          organizationId: id,
          createdAt: new Date(),
          updatedAt: new Date()
        } as unknown as UserNotification;

        await db.collection('notifications').insertOne(notificationData);

        return res.status(200).json({ message: `Successfully invited ${user.displayName} to your organization.` });
      case 'roblox':
        // check if user exists

        const robloxUser = (await db.collection('users').findOne({ 'roblox.id': 0 })) as User | null;
        if (!robloxUser) return res.status(404).json({ message: 'User not found.' });

        // check if user is already a member
        if (Object.values(organization.members).find((item) => item.id === robloxUser.id))
          return res.status(400).json({ message: 'User is already a member.' });

        // add user to organization
        const robloxUuid = uuidv4();
        const robloxData: OrganizationMember = {
          type: 'roblox',
          uuid: robloxUuid,
          id: robloxUser.id,

          role: 1,
          accessGroups: [],
          scanData: {},

          joined: false, // invitee
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('organizations').updateOne({ id }, { $set: { [`members.${robloxUuid}`]: robloxData } });

        return res
          .status(200)
          .json({ message: `Successfully invited ${robloxUser.displayName} to your organization.` });
    }
  }

  if (req.method === 'DELETE') {
    const { uuid } = req.body;
    console.log(uuid);

    // check if user exists
    const organizationMember = Object.values(organization.members).find((item) => item.uuid === uuid);

    if (!organizationMember) return res.status(404).json({ message: 'Member not found.' });

    // check if user is already a member
    if (organizationMember.id === organization.ownerId)
      return res.status(400).json({ message: 'Cannot remove owner.' });

    // remove user from organization
    await db.collection('organizations').updateOne({ id }, { $unset: { [`members.${uuid}`]: '' } });

    return res.status(200).json({ message: 'User removed.' });
  }

  return res.status(405).json({ message: 'Method not allowed.' });
}
