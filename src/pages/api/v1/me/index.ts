import { admin, tokenToID, uploadProfilePicture } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { User } from '@/types';

const sharp = require('sharp');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection('users');
  const user = await users.findOne({ id: uid }) as User | null;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      user: user
    });
  }

  // Updating User Data
  if (req.method === 'PATCH') {
    if (!req.body) {
      return res.status(400).json({ message: 'No body provided' });
    }

    let { displayName, bio } = req.body as any;

    // Character limits

    if (displayName !== null) {
      displayName = displayName.trim();
      if (displayName.length > 32 || displayName.length < 3) {
        return res.status(400).json({ message: 'Display name must be between 3-32 characters.' });
      }
    }

    if (bio) {
      bio = bio.trim();
      if (bio.length >= 256) {
        return res.status(400).json({
          message: 'Bio must be less than or equal to 256 characters.'
        });
      }
    }

    const timestamp = new Date();

    req.body.lastUpdatedAt = timestamp;

    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();

      // check if email is already in use
      const emailExists = await users.findOne({
        'email.address': req.body.email
      });
      if (emailExists) {
        return res.status(400).json({
          message: 'Email is already in use.'
        });
      }

      await admin.auth().updateUser(uid, {
        email: req.body.email
      });

      // update emailVerified to false
      await admin.auth().updateUser(uid, {
        emailVerified: false
      });
      await users.updateOne({ id: uid }, { $set: { 'email.address': req.body.email, 'email.verified': false } });
    }

    // check if avatar is valid
    if (req.body.avatar) {
      let avatar = req.body.avatar;

      let imageFormat = avatar.split(';')[0].split('/')[1]; // ex: jpeg
      // limit gifs for only staff
      if (imageFormat === 'gif' && !user.platform.staff) {
        return res.status(400).json({ message: 'Invalid icon format.' });
      }

      const imageData = Buffer.from(avatar.split(',')[1], 'base64');

      let image;
      if (imageFormat === 'gif') {
        image = await sharp(imageData, { animated: true }).resize(256, 256).gif({ quality: 80, pageHeight: 256 }).toBuffer();
      } else {
        image = await sharp(imageData).resize(256, 256).jpeg({ quality: 80 }).toBuffer();
      }
      // avatar = `data:image/jpeg;base64,${image.toString("base64")}`;

      // upload to firebase
      const url = await uploadProfilePicture('user', uid, image, imageFormat)
        .then((url) => {
          req.body.avatar = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // sanitize body to only include allowed fields
    const allowedFields = ['displayName', 'bio', 'avatar', 'email', 'emailVerified', 'lastUpdatedAt'];
    const sanitizedBody = Object.keys(req.body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key as string] = req.body[key as string];
        return obj;
      }, {});

    await users.updateOne({ id: uid }, { $set: sanitizedBody });

    return res.status(200).json({ message: 'Successfully updated profile!', success: true });
  }

  return res.status(500).json({ message: 'Something went really wrong.' });
}
