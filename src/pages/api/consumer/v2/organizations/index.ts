// types
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type User, type AccessPoint, type Organization, Location } from '@/types';
// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, headers } = req;
  const apiKey = headers['x-api-key'];

  // if (!apiKey) return res.status(401).json({ code: 401, message: 'Unauthorized' });
  const mongo = await clientPromise;
  const db = await mongo.db(process.env.MONGODB_DB as string);
  // const user = (await db.collection('users').findOne({ apiKey })) as User | null;
  const organizations = await db
    .collection('organizations')
    .find(
      {
        ownerId: 'FF0gCiIJYUPfmA4CTfqXTyPcHQb2'
      },
      {
        projection: {
          _id: 0,
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
    )
    .toArray();

  res.status(200).json(organizations);
}
