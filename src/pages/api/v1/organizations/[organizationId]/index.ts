import { tokenToID } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { getRobloxGroups, getRobloxUsers } from '@/lib/utils';
import { OrganizationMember } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Organization ID
  const { organizationId } = req.query as { organizationId: string };

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const organizations = db.collection('organizations');
  const locations = db.collection('locations');
  const invitations = db.collection('invitations');
  const accessPoints = db.collection('accessPoints');
  const users = db.collection('users');
  let organization = (await organizations.findOne({ id: organizationId }, { projection: { apiKeys: 0 } })) as any;

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  if (!organization.members[uid]) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  if (req.method === 'GET') {
    organization.user = organization.members[uid];
    
    let ownerMember = Object.values(organization.members).find(
      (member: any) => member.id === organization.ownerId) as OrganizationMember

    // update organization to have owner member
    if (!ownerMember) {
      // find owner
      ownerMember = Object.values(organization.members).find(
        (member: any) => member.role === 3) as OrganizationMember
      await organizations.updateOne({ id: organizationId }, { $set: { ownerId: ownerMember.id } });
      organization.ownerId = ownerMember.id;
    }

    let ownerUser = await users.findOne({ id: ownerMember.id }, {
      projection: {
        displayName: 1,
        username: 1,
        id: 1,
      }
    });

    organization.owner = ownerUser;

    // get all members
    let members = [];

    // xcs users
    for (const [key, value] of Object.entries(organization.members) as any) {
      if (!['roblox', 'roblox-group'].includes(value.type)) {
        let member = await users.findOne(
          { id: key },
          {
            projection: {
              type: 1,
              name: 1,
              id: 1,
              displayName: 1,
              username: 1,
              avatar: 1
            }
          }
        );
        members.push({
          type: 'user',
          id: key,
          displayName: member?.displayName,
          username: member?.username,
          avatar: member?.avatar,
          ...value
        });
      }
      if (members.length > 99) break;
    }

    // roblox users

    // make an array of roblox user and group ids
    let robloxUserIds = [];
    let robloxGroupIds = [];

    for (const [key, value] of Object.entries(organization.members) as any) {
      if (value.type === 'roblox') {
        robloxUserIds.push(value.id);
      } else if (value.type === 'roblox-group') {
        robloxGroupIds.push(value.id);
      }
    }

    // get roblox users
    let robloxUsers = await getRobloxUsers(robloxUserIds);
    let robloxGroups = await getRobloxGroups(robloxGroupIds);

    // add roblox users to members array
    for (const [key, value] of Object.entries(organization.members) as any) {
      if (value.type === 'roblox') {
        members.push({
          id: key,
          displayName: robloxUsers[value.id].displayName,
          username: robloxUsers[value.id].name,
          avatar: robloxUsers[value.id].avatar,
          ...value
        });
      } else if (value.type === 'roblox-group') {
        members.push({
          id: key,
          displayName: robloxGroups[value.id].name,
          username: robloxGroups[value.id].name,
          avatar: robloxGroups[value.id].avatar,
          roleset: robloxGroups[value.id].roles,
          ...value
        });
      }
      if (members.length > 99) break;
    }

    organization.members = members.sort((a: any, b: any) =>
      a.role > b.role || b.type === 'roblox-group' || b.type === 'roblox' ? -1 : 1
    ); // sort by role (descending)

    // Get Access Points
    for (const accessGroupId in organization.accessGroups) {
      const accessGroup = organization.accessGroups[accessGroupId];
      if (accessGroup.locationId) {
        const location = await locations.findOne({ id: accessGroup.locationId }, { projection: { name: 1, id: 1 } });
        if (location) organization.accessGroups[accessGroupId].locationName = location.name;
      }
    }

    return res.status(200).json({
      organization: organization
    });
  }

  // Updating Location Data
  if (req.method === 'PUT') {
    if (!req.body) {
      return res.status(400).json({ message: 'No body provided' });
    }

    let body = req.body as any;

    // Character limits
    if (body.name !== undefined) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res.status(400).json({ message: 'Name must be between 3-32 characters.' });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (body.description.length > 256) {
        return res.status(400).json({ message: 'Description must be less than 256 characters.' });
      }
    }

    // Prevent values from being tampered with
    delete body.logs;
    delete body.id;
    delete body.apiKeys;
    delete body.members;
    // if (body.members[uid] && organization.members[uid].role < 3) {
    //   delete body.members;
    // }

    // Character limits
    if (body.name) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res.status(400).json({ message: 'Name must be between 3-32 characters.' });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (body.description.length >= 256) {
        return res.status(400).json({
          message: 'Description must be less than or equal to 256 characters.'
        });
      }
    }

    // Check if name is taken
    if (body.name) {
      const checkName = await organizations.findOne(
        {
          name: { $regex: new RegExp(`^${body.name}$`, 'i') }
        },
        { projection: { id: 1 } }
      );
      if (checkName && checkName.id !== organization.id) {
        return res.status(400).json({ message: 'This name is taken. Please choose another.' });
      }
    }

    const timestamp = new Date();

    body.updatedAt = timestamp;

    await organizations.updateOne({ id: organizationId }, { $set: body });
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: 'organization-updated',
            performer: uid,
            timestamp: timestamp,
            data: body
          }
        }
      }
    );

    return res.status(200).json({ message: 'Successfully updated organization!', success: true });
  }

  // Deleting Organization Data
  if (req.method === 'DELETE') {
    const timestamp = new Date();

    // Delete Organization
    await organizations.deleteOne({ id: organizationId });

    // Delete All Locations in Organization
    await locations.deleteMany({ organizationId: organizationId });

    // Delete All Invitations in Organization
    await invitations.deleteMany({ organizationId: organizationId });

    // Delete All Access Points in Organization
    await accessPoints.deleteMany({ organizationId: organizationId });

    return res.status(200).json({ message: 'Successfully deleted organization!', success: true });
  }

  return res.status(500).json({
    message: 'An unknown errror occurred. If this error persists, please contact customer support.'
  });
}
