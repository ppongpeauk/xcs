// types
import { type User, type AccessPoint, Organization, DeveloperApplication } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { uuid as uuidv4 } from 'uuidv4';
import { generate as generateString } from 'randomstring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['DELETE'].includes(req.method as string)) return res.status(405).json({ message: 'Method not allowed.' });

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if user exists
  if (!user) return res.status(401).json({ message: 'Unauthorized.' });

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) return res.status(400).json({ message: 'Missing parameters.' });

    const app = await db.collection('developerApplications').findOne({ id });

    if (!app) return res.status(400).json({ message: 'Application not found.' });
    if (app.createdBy !== uid) return res.status(401).json({ message: 'Unauthorized.' });

    await db.collection('developerApplications').deleteOne({ id });

    return res.status(200).json({ success: true, message: 'Application deleted.' });
  }
}
