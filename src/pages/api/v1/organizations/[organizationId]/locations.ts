import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Organization ID
  const { organizationId } = req.query as { organizationId: string };

  if (req.method !== "GET") {
    console.log(req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Authorization Header
  const authHeader = req.headers.authorization;

  // Bearer Token
  const token = authHeader?.split(" ")[1];

  // Verify Token
  const uid = tokenToID(token as string);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const locations = await db
        .collection("locations")
        .find({ organizationId: organizationId })
        .toArray();

  res.status(200).json({ locations: locations });
}
