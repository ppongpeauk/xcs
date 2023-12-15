import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Organization, User, UserNotification } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    console.log(req.method);
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);

  let user = (await db
    .collection('users')
    .findOne({ id: uid }, { projection: { id: 1, displayName: 1, username: 1, notifications: 1 } })) as unknown as User;

  if (!user) return res.status(404).json({ message: 'User not found.' });

  let notifications = (await db
    .collection('notifications')
    .find({
      recipientId: uid
    })
    .sort({ createdAt: -1 })
    .toArray()) as unknown as UserNotification[];

  let cachedOrganizations = {} as Record<string, Organization>;
  let cachedUsers = {} as Record<string, User>;
  notifications = (await Promise.all(
    notifications.map(async (notification: UserNotification) => {
      let sender = cachedUsers[notification.senderId as string];
      if (notification?.senderId) {
        // try to get sender from cache
        // fallback to database
        if (!sender) {
          sender = (await db.collection('users').findOne(
            { id: notification.senderId },
            {
              projection: {
                id: 1,
                displayName: 1,
                username: 1,
                avatar: 1
              }
            }
          )) as never as User;
        }
        notification.sender = sender;
      }

      if (notification.type === 'organization-invitation') {
        // try to get organization from cache
        let organization = cachedOrganizations[notification.organizationId as string];
        // fallback to database
        if (!organization) {
          organization = (await db
            .collection('organizations')
            .findOne({ id: notification.organizationId })) as never as Organization;
        }

        if (!organization) return notification;

        notification.title = `You've been invited to join ${organization.name}.`;
        notification.icon = organization.avatar;
        notification.organization = organization;
      }

      return notification;
    })
  )) as unknown as UserNotification[];

  // update user notifications to read state
  await db.collection('notifications').updateMany({ recipientId: uid, read: false }, { $set: { read: true } });

  return res.status(200).json(notifications);
}
