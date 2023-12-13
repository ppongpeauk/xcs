import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Organization, OrganizationMember, User } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

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

  if (req.method === 'GET') {
    let members = organization.members;
    for (const key of Object.keys(members)) {
      let member = members[key];
      if (member?.type === 'user' || !member?.type) {
        // fetch user data
        const user = (await db.collection('users').findOne(
          { id: key },
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

  return res.status(405).json({ message: 'Method not allowed.' });
}
