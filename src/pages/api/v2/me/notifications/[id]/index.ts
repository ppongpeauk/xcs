import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { Organization, User, UserNotification } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: notificationId } = req.query;
  const { action } = req.body;
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);

  let user = (await db
    .collection('users')
    .findOne({ id: uid }, { projection: { id: 1, displayName: 1, username: 1, notifications: 1 } })) as unknown as User;

  if (!user) return res.status(404).json({ message: 'User not found.' });

  let notification = (await db.collection('notifications').findOne({
    id: notificationId
  })) as unknown as UserNotification;

  if (!notification) return res.status(404).json({ message: 'Notification not found.' });

  // check ownership
  if (notification.recipientId !== uid) return res.status(401).json({ message: 'Unauthorized.' });

  if (notification.type === 'organization-invitation') {
    let organization = (await db
      .collection('organizations')
      .findOne({ id: notification.organizationId })) as never as Organization;

    if (!organization) return res.status(404).json({ message: 'Organization not found.' });
    switch (req.method) {
      case 'GET':
        return res.status(200).json(notification);
      case 'DELETE':
        await db.collection('notifications').deleteOne({ id: notificationId });
        return res.status(200).json({ message: 'Notification deleted.' });
      case 'PATCH':
        if (action === 'accept') {
          // check if user is already a member
          let member = Object.values(organization.members).find((member) => member.id === uid);
          if (member?.joined) {
            return res.status(400).json({ message: 'You are already a member of this organization.' });
          }

          // update joined property of organization member
          // find key of user in members object
          let key = Object.keys(organization.members).find((key) => organization.members[key].id === uid);
          if (!key) return res.status(404).json({ message: 'User not found in organization.' });

          await db.collection('organizations').updateOne(
            { id: notification.organizationId },
            {
              $set: {
                [`members.${key}.joined`]: true,
                [`members.${key}.createdAt`]: new Date(),
                [`members.${key}.updatedAt`]: new Date()
              }
            }
          );

          // remove notification
          await db.collection('notifications').deleteOne({ id: notificationId });
          return res.status(200).json({ message: 'Invitation accepted.' });
        } else if (action === 'reject') {
          // remove notification
          await db.collection('notifications').deleteOne({ id: notificationId });

          // remove key-value pair from members object
          try {
            let key = Object.keys(organization.members).find((key) => organization.members[key].id === uid);
            await db
              .collection('organizations')
              .updateOne({ id: notification.organizationId }, { $unset: { [`members.${key}`]: '' } });
          } catch (error) {
            console.error(error);
          }

          return res.status(200).json({ message: 'Invitation rejected.' });
        } else {
          return res.status(400).json({ message: 'Invalid action.' });
        }
    }
  } else {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(notification);
      case 'DELETE':
        await db.collection('notifications').deleteOne({ id: notificationId });
        return res.status(200).json({ message: 'Notification deleted.' });
    }
  }

  return res.status(400).json({ message: 'Invalid notification type.' });
}
