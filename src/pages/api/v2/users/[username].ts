import { NextApiRequest, NextApiResponse } from 'next';

import clientPromise from '@/lib/mongodb';
import { Achievement, Organization, User } from '@/types';
import { authToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query as { username: string };

  // check if the user is authenticated
  const uid = await authToken(req);

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection('users');
  const organizations = db.collection('organizations');

  let user = (await users.findOne(
    { username: username },
    { projection: { email: 0, notifications: 0, alerts: 0, payment: 0 } }
  )) as unknown as User | null;

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (req.method === 'GET') {
    // get user organizations
    // check privacy

    if (user.privacy?.organizations || user.privacy?.organizations === undefined || user.id === uid) {
      // let userOrgs = await organizations
      //   .find(
      //     { [`members.${user.id}`]: { $exists: true } },
      //     { projection: { id: 1, name: 1, description: 1, avatar: 1, verified: 1, [`members.${user.id}`]: 1 } }
      //   )
      //   .toArray();

      let organizations = (await db
        .collection('organizations')
        .aggregate([
          {
            $project: {
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
              membersValues: { $objectToArray: '$members' }
            }
          },
          {
            $match: {
              'membersValues.v.id': user.id
            }
          },
          {
            $project: {
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
              matchingMembers: {
                $filter: {
                  input: '$membersValues',
                  as: 'member',
                  cond: { $eq: ['$$member.v.id', user.id] }
                }
              }
            }
          },
          {
            $match: {
              $or: [{ 'matchingMembers.v.joined': { $exists: false } }, { 'matchingMembers.v.joined': true }]
            }
          }
        ])
        .toArray()) as unknown as Organization[];

      user.organizations = organizations as unknown as Organization[];
    }

    // get user achievements
    let achievements: Record<string, Achievement> = {};
    for (let achievement of (Object.values(user.achievements || {}) as { id: string; earnedAt: Date }[]) || []) {
      let achievementData = (await db.collection('achievements').findOne({ id: achievement.id })) as Achievement | null;
      if (achievementData) {
        achievementData.description = achievementData.description.replace('{{displayName}}', user.displayName);
        achievement = { ...achievement, ...achievementData };
        achievements[achievement.id] = achievement as unknown as Achievement;
      }
    }

    return res.status(200).json({
      user: {
        ...user,
        achievements
      }
    });
  }

  return res.status(500).json({ message: 'An unknown errror occurred.' });
}
