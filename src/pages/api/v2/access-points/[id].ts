// types
import { type User, type AccessPoint, Organization } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Missing id.' });

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if user exists
  if (!user) return res.status(401).json({ message: 'Unauthorized.' });

  // lookup access point
  const accessPoint = (await db.collection('accessPoints').findOne({ id })) as AccessPoint | null;
  if (!accessPoint) return res.status(404).json({ message: 'Access point not found.' });

  // check if user is a member of the organization
  const organization = (await db.collection('organizations').findOne(
    { id: accessPoint.organizationId },
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
        updatedBy: 1
      }
    }
  )) as Organization | null;
  if (!organization) return res.status(404).json({ message: 'Organization not found.' });
  if (!organization.members[uid]) return res.status(401).json({ message: 'Unauthorized.' });

  const location = (await db.collection('locations').findOne({ id: accessPoint.locationId })) as Location | null;
  if (!location) return res.status(404).json({ message: 'Location not found.' });

  // GET
  if (req.method === 'GET') {
    return res.status(200).json({
      ...accessPoint,
      organization,
      location
    });
  } else if (req.method === 'PATCH') {
    // TODO: sanitize input
    const { name, description = '', tags = [], config } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing required fields.' });

    // update access point
    await db.collection('accessPoints').updateOne(
      { id },
      {
        $set: {
          name,
          description,
          tags,
          config: {
            ...accessPoint.config,
            ...config
          }
        }
      },
      { upsert: true }
    );

    return res.status(200).json({ message: 'Access point updated.' });
  } else if (req.method === 'DELETE') {
    return res.status(200).json({ message: 'Access point deleted.' });
  }
}
