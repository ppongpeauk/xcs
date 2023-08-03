import { admin, app, tokenToID } from '@/pages/api/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { generate as generateString } from 'randomstring';

import clientPromise from '@/lib/mongodb';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let { activationCode } = req.query as { activationCode: string };

    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB as string);
    const invitations = db.collection('invitations');
    // console.log(activationCode);
    const invitation = await invitations.findOne({
      type: 'xcs',
      inviteCode: activationCode[0]
    });

    if (!invitation) {
      return res.status(404).json({
        valid: false,
        message: 'Invalid activation code.'
      });
    }

    if (invitation?.uses >= invitation?.maxUses) {
      return res.status(403).json({
        valid: false,
        message: `This activation code has reached its maximum uses.`
      });
    }

    return res.status(200).json({
      valid: true,
      message: 'Valid activation code.'
    });
  }

  if (req.method === 'POST') {
    let { activationCode } = req.query as { activationCode: string };

    let { displayName, email, username, password } = req.body as {
      displayName: string;
      email: string;
      username: string;
      password: string;
    };

    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB as string);
    const invitations = db.collection('invitations');
    const users = db.collection('users');

    let invitation = await invitations.findOne(
      {
        type: 'xcs',
        inviteCode: activationCode[0]
      },
      { projection: { _id: 0, uses: 1, maxUses: 1 } }
    );

    if (!invitation) {
      return res.status(404).json({
        message: 'Invalid activation code. This code may have already been used.'
      });
    }

    if (invitation?.uses !== 0 && invitation?.uses >= invitation?.maxUses) {
      return res.status(403).json({
        message: `This activation code has reached its maximum uses.`
      });
    }

    // Check body for missing fields and character length
    if (
      // !firstName ||
      // !lastName ||
      !displayName ||
      !email ||
      !username ||
      !password ||
      !activationCode
    ) {
      return res.status(400).json({
        message: 'Missing one or more required fields.'
      });
    }

    if (displayName.length > 32) {
      return res.status(400).json({
        message: 'Display name must be less than 32 characters.'
      });
    }

    // if (firstName.length > 32) {
    //   return res.status(400).json({
    //     message: "First name must be less than 32 characters.",
    //   });
    // }

    // if (lastName.length > 32) {
    //   return res.status(400).json({
    //     message: "Last name must be less than 32 characters.",
    //   });
    // }

    if (username.length > 32) {
      return res.status(400).json({
        message: 'Username must be less than 32 characters.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.'
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: 'Username must only contain letters, numbers, and underscores.'
      });
    }

    // Check if username is taken
    await users
      .findOne({
        username
      })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            message: 'Username is already taken.'
          });
        }
      });

    let firebaseError;
    await app();
    const firebaseUser = await admin
      .auth()
      .createUser({
        email,
        password,
        emailVerified: false
      })
      .then((userRecord) => {
        return userRecord;
      })
      .catch((error) => {
        return error;
      });

    if (firebaseUser.code) {
      firebaseError = firebaseUser;
      switch (firebaseError.code) {
        case 'auth/email-already-exists':
          return res.status(400).json({
            message: 'An account with this email address already exists.'
          });
          break;
        case 'auth/invalid-email':
          return res.status(400).json({
            message: 'Invalid email address.'
          });
          break;
        case 'auth/operation-not-allowed':
          return res.status(400).json({
            message: 'Email/password accounts are not enabled.'
          });
          break;
        case 'auth/weak-password':
          return res.status(400).json({
            message: 'Password is too weak.'
          });
          break;
        default:
          return res.status(500).json({
            message: 'An unknown error has occurred while creating your account.'
          });
          break;
      }
    }

    const createMongoUser = await users
      .insertOne({
        displayName: displayName,
        email: {
          address: email.trim().toLowerCase(),
          privacyLevel: 2,
          verified: false
        },
        username: username.toLowerCase(),
        notifications: {
          email: {
            enabled: true,
            frequency: 'daily'
          }
        },
        alerts: [
          {
            title: 'Email address not verified',
            description: `Your email address has not been verified. Please check your email for a verification link.`,
            type: 'warning',
            action: {
              title: 'Verify email',
              url: `${process.env.NEXT_PUBLIC_ROOT_URL}/platform/onboarding/verify-email`
            }
          }
        ],
        platform: {
          membership: 'basic'
        },
        payment: {
          customerId: null
        },
        roblox: {
          id: null,
          username: null,
          verified: false,
          verifiedAt: null
        },
        discord: {
          id: null,
          username: null,
          verified: false,
          verifiedAt: null
        },
        avatar: `${process.env.NEXT_PUBLIC_ROOT_URL}/images/default-avatar.png`,
        bio: null,
        id: firebaseUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .then(async (result) => {
        if (invitation?.uses + 1 >= invitation?.maxUses) {
          await invitations.deleteOne({
            inviteCode: activationCode[0]
          });
        } else {
          await invitations.updateOne({ inviteCode: activationCode[0] }, { $inc: { uses: 1 } });
        }
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });

    const email_link = await admin.auth().generateEmailVerificationLink(email.trim().toLowerCase(), {
      url: `${process.env.NEXT_PUBLIC_ROOT_URL}/platform/onboarding/verify-email`,
      handleCodeInApp: true
    }).then((link) => {
      return link;
    }).catch((error) => {
      console.log(error);
      throw error;
    });

    // console.log(email_link);

    const msg = {
      to: email.trim().toLowerCase(), // Change to your recipient
      from: 'xcs-noreply@restrafes.co', // Change to your verified sender
      subject: 'Verify your email address',
      template_id: 'd-9dd7e88dbb554984867e7da76c9d6c6f',
      dynamic_template_data: {
        name: displayName,
        link: email_link
      }
    }
    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error: any) => {
        return res.status(500).json({ success: false, message: error });
      }).then(() => {
        return res.status(200).json({ success: true, message: 'Email sent.' });
      });

    return res.status(200).json({
      message: 'Successfully registered! You may now login.',
      success: true
    });
  }

  return res.status(500).json({ message: 'An unknown error has occurred.' });
}
