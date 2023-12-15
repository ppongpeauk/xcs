import clientPromise from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB as string);

  // check if user is a member of the organization
  const platform = await db.collection('platform').findOne({ id: 'main' });

  if (req.method === 'GET') {
    return res.status(200).json(platform);
  }
}
