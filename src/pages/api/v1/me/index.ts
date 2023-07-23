import { authToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

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

    await users.updateOne({ id: uid }, { $set: req.body });

    return res
      .status(200)
      .json({ message: "Successfully updated profile!", success: true });
  }

  return res.status(500).json({ message: "Something went really wrong." });
}
