// types
import { type User, type AccessPoint, Organization } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['DELETE'].includes(req.method as string)) return res.status(405).json({ message: 'Method not allowed.' });

  // check if the user is authenticated
  console.log(req.headers);
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if user exists
  if (!user) return res.status(401).json({ message: 'Unauthorized.' });

  // check if user is a part of the beta program
  if (!user.platform?.features?.beta?.enabled) return res.status(401).json({ message: 'Unauthorized.' });

  await db
    .collection('users')
    .updateOne({ id: uid }, { $set: { 'platform.features.beta': { enabled: false, createdAt: null } } });

  return res.status(200).json({
    message: 'You have been removed from the beta program.'
  });
}
