import { authToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { admin, tokenToID, uploadProfilePicture } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
const sharp = require("sharp");

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '4mb'
      }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection("users");
  const user = await users.findOne({ id: uid });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      user: user,
    });
  }

  // Updating User Data
  if (req.method === "PATCH") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let { displayName, bio } = req.body as any;

    // Character limits

    if (displayName !== null) {
      displayName = displayName.trim();
      if (displayName.length > 32 || displayName.length < 3) {
        return res
          .status(400)
          .json({ message: "Display name must be between 3-32 characters." });
      }
    }

    if (bio) {
      bio = bio.trim();
      if (bio.length >= 256) {
        return res.status(400).json({
          message: "Bio must be less than or equal to 256 characters.",
        });
      }
    }

    const timestamp = new Date();

    req.body.lastUpdatedAt = timestamp;

    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();

      // check if email is already in use
      const emailExists = await users.findOne({
        "email.address": req.body.email,
      });
      if (emailExists) {
        return res.status(400).json({
          message: "Email is already in use.",
        });
      }

      await admin.auth().updateUser(uid, {
        email: req.body.email,
      });

      // update emailVerified to false
      await admin.auth().updateUser(uid, {
        emailVerified: false,
      });
      await users.updateOne({ id: uid }, { $set: { "email.address": req.body.email, "email.verified": false } });
    }

    // check if avatar is valid
    if (req.body.avatar) {
      let avatar = req.body.avatar;
      const imageData = Buffer.from(avatar.split(",")[1], "base64");
      const image = await sharp(imageData)
        .resize(256, 256)
        .jpeg({quality: 80})
        .toBuffer();
      // avatar = `data:image/jpeg;base64,${image.toString("base64")}`;

      // upload to firebase
      const url = await uploadProfilePicture(uid, image)
        .then((url) => {
          req.body.avatar = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    await users.updateOne({ id: uid }, { $set: req.body });

    return res
      .status(200)
      .json({ message: "Successfully updated profile!", success: true });
  }

  return res.status(500).json({ message: "Something went really wrong." });
}
