import { tokenToID } from '@/pages/api/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection('users');
  const user = await users.findOne({ id: uid });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.method === 'POST') {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Missing code.' });
    }

    // fetch access token from code
    const accessTokenResponse = await fetch(`https://apis.roblox.com/oauth/v1/token`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID + ':' + process.env.ROBLOX_CLIENT_SECRET).toString('base64')
      },
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
      })
    });

    const accessToken = await accessTokenResponse.json();
    if (!accessToken.access_token) {
      return res.status(400).json({ message: 'Invalid code.' });
    }

    // fetch user info from access token
    const userInfoResponse = await fetch(`https://apis.roblox.com/oauth/v1/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`
      }
    });
    const userInfo = await userInfoResponse.json();
    if (!userInfo.sub) {
      return res.status(400).json({ message: 'Could not fetch user info from authorization.' });
    }

    // unverify other accounts with the same roblox id
    const otherUsers = await users.find({ 'roblox.id': userInfo.sub }).toArray();
    for (const otherUser of otherUsers) {
      if (otherUser.id === uid) continue; // skip logged in user
      await users.updateOne(
        { id: otherUser.id },
        {
          $set: {
            lastUpdatedAt: new Date(),
            roblox: {
              verified: false,
              verifiedAt: null,
              id: null,
              username: null
            }
          }
        }
      );
    }

    // verify user
    const timestamp = new Date();
    await users
      .updateOne(
        { id: uid },
        {
          $set: {
            lastUpdatedAt: timestamp,
            roblox: {
              verified: true,
              verifiedAt: timestamp,
              id: userInfo.sub,
              username: userInfo.name
            }
          }
        }
      )
      .then(() => {
        return res.status(200).json({
          message: "You've successfully verified your Roblox account.",
          success: true
        });
      })
      .catch((err) => {
        return res.status(500).json({ message: 'Something went really wrong.' });
      });
    return;
  } else if (req.method === 'DELETE') {
    if (!user.roblox.verified) {
      return res.status(400).json({
        message: 'You are not verified.'
      });
    }

    const timestamp = new Date();
    await users.updateOne(
      { id: uid },
      {
        $set: {
          lastUpdatedAt: timestamp,
          roblox: {
            verified: false,
            id: null,
            username: null
          }
        }
      }
    );
    await users.updateOne(
      { id: uid },
      {
        $push: {
          logs: {
            type: 'account_unlink',
            performer: uid,
            timestamp: timestamp,
            data: 'roblox'
          }
        }
      }
    );

    return res.status(200).json({
      message: "You've successfully unverified your Roblox account.",
      success: true
    });
  }

  return res.status(500).json({ message: 'Something went really wrong.' });
}
