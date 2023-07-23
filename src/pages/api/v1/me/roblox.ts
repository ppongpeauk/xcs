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

  if (req.method === "DELETE") {
    if (!user.roblox.verified) {
      return res.status(400).json({
        message: "You are not verified.",
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
            username: null,
          },
        },
      }
    );
    await users.updateOne(
      { id: uid },
      {
        $push: {
          logs: {
            type: "account_unlink",
            performer: uid,
            timestamp: timestamp,
            data: "roblox",
          },
        },
      }
    );

    return res
      .status(200)
      .json({
        message: "You've successfully unverified your Roblox account.",
        success: true,
      });
  }

  return res.status(500).json({ message: "Something went really wrong." });
}
