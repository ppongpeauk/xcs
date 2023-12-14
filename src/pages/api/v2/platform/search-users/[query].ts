import { tokenToID } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { query } = req.query;
  query = decodeURIComponent(query as string);

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection('users');
  const user = await users.findOne({ id: uid });

  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (req.method === 'GET') {
    // 28 = length of a firebase uid
    let flags = [
      { username: { $regex: query as string, $options: 'i' } },
      { displayName: { $regex: query as string, $options: 'i' } },
      { email: { $regex: query as string, $options: 'i' } }
    ];
    if (query.length >= 28) flags.push({ id: { $regex: query as string, $options: 'i' } } as any);
    const result = await users
      .find(
        {
          $or: flags
        },
        {
          projection: {
            _id: 0,
            id: 1,
            username: 1,
            displayName: 1,
            avatar: 1
          }
        }
      )
      .limit(10)
      .toArray();

    return res.status(200).json(result);
  }
}
