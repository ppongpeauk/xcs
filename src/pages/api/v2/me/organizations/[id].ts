// types
import { type User, type AccessPoint, Organization } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      message: 'Method not allowed'
    });
  }

  const { organizations, linkScans } = req.body;

  // check if fields are null
  if (organizations === null || linkScans === null) {
    return res.status(400).json({
      message: 'Missing required fields.'
    });
  }

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if user exists
  if (!user) return res.status(401).json({ message: 'Unauthorized.' });

  await db.collection('users').updateOne(
    { id: uid },
    {
      $set: {
        privacy: {
          organizations,
          linkScans
        }
      }
    }
  );

  return res.status(200).json({
    message: 'Your privacy settings have been updated.'
  });
}
