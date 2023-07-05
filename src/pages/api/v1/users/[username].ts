import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query as { username: string };

  // // Authorization Header
  // const authHeader = req.headers.authorization;

  // // Bearer Token
  // const token = authHeader?.split(" ")[1];

  // // Verify Token
  // const uid = await tokenToID(token as string);
  // if (!uid) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const users = db.collection("users");
  let user = (await users.findOne({ username: username })) as any;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      user: user,
    });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
