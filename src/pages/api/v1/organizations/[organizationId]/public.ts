import { deleteOrganizationProfilePicture, tokenToID, uploadProfilePicture } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { getRobloxGroups, getRobloxUsers } from '@/lib/utils';
import { OrganizationMember, User } from '@/types';

const sharp = require('sharp');

export const config = {
  api: {
    responseLimit: '16mb',
    bodyParser: {
      sizeLimit: '16mb'
    }
  }
};

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
  const users = db.collection('users');
  let canEdit = false;

  let organization = (await organizations.findOne({ id: organizationId }, {
    projection: {
      id: 1,
      name: 1,
      description: 1,
      avatar: 1,
      ownerId: 1,
      members: 1,
      createdAt: 1,
      updatedAt: 1,
      verified: 1,
      isPersonal: 1,
    }
  })) as any;

  if (!organization) {
    return res.status(404).json({ message: 'Organization not found' });
  }

  if (organization.members[uid] && organization.members[uid].role > 1) {
    canEdit = true;
  }

  if (req.method === 'GET') {
    organization.user = organization.members[uid];

    let ownerMember = Object.values(organization.members).find(
      (member: any) => member.id === organization.ownerId) as OrganizationMember

    // update organization to have owner member
    if (!organization.ownerId) {
      // find owner
      const ownerMemberId = Object.keys(organization.members).find(
        (key: any) => organization.members[key].role === 3) as string;
      ownerMember = organization.members[ownerMemberId] as OrganizationMember;
      await organizations.updateOne({ id: organizationId }, { $set: { ownerId: ownerMemberId } });
      organization.ownerId = ownerMemberId;
    }

    let ownerUser = await users.findOne({ id: organization.ownerId }, {
      projection: {
        id: 1,
        displayName: 1,
        username: 1,
        avatar: 1,
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

    organization.canEdit = canEdit;

    return res.status(200).json({
      organization: organization,
    });
  }

  return res.status(500).json({
    message: 'An unknown errror occurred. If this error persists, please contact customer support.'
  });
}
