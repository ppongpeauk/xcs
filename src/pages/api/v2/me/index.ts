import { admin, uploadProfilePicture } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { User } from '@/types';

import sharp from 'sharp';

export const config = {
  api: {
    responseLimit: '16mb',
    bodyParser: {
      sizeLimit: '16mb'
    }
  }
};

// regexes
const regexWebsite = /^(https?:\/\/)/i;
const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongo = await clientPromise;
  const db = mongo.db(process.env.MONGODB_DB as string);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const notifications = (await db
    .collection('notifications')
    .find({ recipient: uid })
    .toArray()) as unknown as Notification[];

  if (req.method === 'GET') {
    const invitationsCount = await db.collection('organizationInvitations').countDocuments({ recipientId: uid });
    return res.status(200).json({
      user: {
        ...user,
        statistics: {
          organizationInvitations: invitationsCount
        },
        notifications
      }
    });
  }

  // update profile
  if (req.method === 'PATCH') {
    // parameters to update
    if (!req.body) return res.status(400).json({ message: 'No body provided.' });
    let { displayName, bio, avatar, email, website } = req.body as any;

    // validate parameters
    if (displayName && displayName.length > 32) return res.status(400).json({ message: 'Display name too long.' });
    if (bio && bio.length > 512) return res.status(400).json({ message: 'Bio too long.' });
    if (website && !regexWebsite.test(website)) return res.status(400).json({ message: 'Invalid website.' });
    if (email && !regexEmail.test(email)) return res.status(400).json({ message: 'Invalid email.' });

    // update email if changed
    if (email) {
      const exists = await db.collection('users').findOne({ 'email.address': email });
      if (exists) return res.status(400).json({ message: 'Email already in use.' });
      await admin.auth().updateUser(uid, { email: req.body.email, emailVerified: false });
      await db
        .collection('users')
        .updateOne({ id: uid }, { $set: { 'email.address': req.body.email, 'email.verified': false } });
    }

    // check if avatar is valid
    let newAvatarUrl = null;
    if (avatar) {
      let imageFormat = avatar.split(';')[0].split('/')[1]; // ex: jpeg
      // limit gifs for only staff due to storage
      if (imageFormat === 'gif' && !user.platform.staff) {
        return res.status(400).json({ message: 'Invalid icon format.' });
      }

      const imageData = Buffer.from(avatar.split(',')[1], 'base64');

      let image;
      if (imageFormat === 'gif') {
        image = await sharp(imageData, { animated: true })
          .resize(256, 256)
          .gif({ quality: 80, pageHeight: 256 } as any)
          .toBuffer();
      } else {
        image = await sharp(imageData).resize(256, 256).jpeg({ quality: 80 }).toBuffer();
      }

      // upload to firebase
      const url = await uploadProfilePicture('user', uid, image as any, imageFormat)
        .then((url) => {
          newAvatarUrl = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    await db.collection('users').updateOne(
      { id: uid },
      {
        $set: {
          displayName: displayName || user.displayName,
          avatar: newAvatarUrl || avatar || user.avatar,
          'about.bio': bio,
          'about.website': website
        },
        $unset: {
          bio: ''
        }
      }
    );
    return res.status(200).json({ message: 'Successfully updated profile.', success: true });
  }

  return res.status(500).json({ message: 'Something went really wrong. Please try again later.' });
}
