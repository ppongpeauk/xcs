import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId } = req.query as { organizationId: string };

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
  const organizations = db.collection("organizations");
  const locations = db.collection("locations");
  let organization = (await organizations.findOne({
    id: organizationId,
  })) as any;

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Leave Organization
  if (req.method === "DELETE") {
    const time = new Date();
    const timestamp = time.getTime();

    // Reject if user is the manager
    if (organization.members[uid].role >= 3) {
      return res.status(403).json({
        message: "You cannot leave an organization you own.",
        success: false,
      });
    }

    // Leave Organization
    await organizations.updateOne(
      { id: organizationId },
      {
        $unset: {
          [`members.${uid}`]: "",
        },
      }
    );

    // Log
    await organizations.updateOne(
      { id: organizationId },
      {
        $push: {
          logs: {
            type: "member-left",
            performer: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Successfully left organization!", success: true });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}