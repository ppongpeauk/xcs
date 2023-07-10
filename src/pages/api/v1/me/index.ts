import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Authorization Header
  const authHeader = req.headers.authorization;

  // Bearer Token
  const token = authHeader?.split(" ")[1];

  // Verify Token
  const uid = await tokenToID(token as string);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized" });
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

  // Updating Location Data
  if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let body = req.body as any;
    delete body.logs; // Prevent logs from being tampered

    // Character limits

    if (body.name) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (body.bio) {
      body.bio = body.bio.trim();
      if (body.bio.length >= 256) {
        return res.status(400).json({
          message: "Biography must be less than or equal to 256 characters.",
        });
      }
    }

    const timestamp = new Date();

    body.lastUpdatedDate = timestamp;

    await users.updateOne({ id: uid }, { $set: body });
    await users.updateOne(
      { id: uid },
      {
        $push: {
          logs: {
            type: "user_updated",
            performer: uid,
            timestamp: timestamp,
            data: body,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "successfully updated", success: true });
  }

  return res.status(500).json({ message: "something went really wrong" });
}
