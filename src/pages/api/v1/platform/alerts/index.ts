import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const platform = db.collection("platform");
  const doc = await platform.findOne({ id: "main" });

  const alerts = doc?.alerts || [];

  return res.status(200).json(alerts);
}