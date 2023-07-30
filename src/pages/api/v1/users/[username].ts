import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query as { username: string };

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection('users');
  const organizations = db.collection('organizations');
  let user = (await users.findOne(
    { username: username },
    { projection: { email: 0, notifications: 0, alerts: 0, payment: 0 } }
  )) as any;

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (req.method === 'GET') {
    let userOrgs = await organizations
      .find(
        { [`members.${user.id}`]: { $exists: true } },
        { projection: { id: 1, name: 1, description: 1, avatar: 1, verified: 1, [`members.${user.id}`]: 1 } }
      )
      .toArray();

    user.organizations = userOrgs;

    return res.status(200).json({
      user: user
    });
  }

  return res.status(500).json({ message: 'An unknown errror occurred.' });
}
