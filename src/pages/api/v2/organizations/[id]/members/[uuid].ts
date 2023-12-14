import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Organization, OrganizationMember, User } from '@/types';
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

  if (req.method === 'DELETE') {
    const { uuid } = req.query;

    // check if user exists
    const organizationMember = Object.values(organization.members).find(
      (item) => item.uuid === uuid || item.id === uuid
    );

    if (!organizationMember) return res.status(404).json({ message: 'Member not found.' });

    // check if user is already a member
    if (organizationMember.id === organization.ownerId)
      return res.status(400).json({ message: 'You cannot remove the owner.' });

    if (organizationMember.id === uid) return res.status(400).json({ message: 'You cannot remove yourself.' });

    // remove user from organization
    await db.collection('organizations').updateOne({ id }, { $unset: { [`members.${uuid}`]: '' } });

    return res.status(200).json({ message: 'Removed user from the organization.' });
  }

  return res.status(405).json({ message: 'Method not allowed.' });
}
