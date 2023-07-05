import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { generate as generateString } from "randomstring";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Organization ID
  const { organizationId } = req.query as { role: string, organizationId: string };
  const { role, singleUse } = req.body as { role: number, singleUse: boolean };

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
  const invitations = db.collection("invitations");
  let organization = (await organizations
    .findOne({ id: organizationId })) as any

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid] || organization.members[uid].role < 3) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Create Invite Code
  if (req.method === "POST") {
    const time = new Date();
    const timestamp = time.getTime();

    const inviteCode = generateString({
      length: 8,
      charset: "alphanumeric",
    });

    await invitations.insertOne({
      inviteCode: inviteCode,
      creatorId: uid,
      organizationId: organization.id,
      role: role,
      createdAt: timestamp,
      singleUse: singleUse,
    });
    
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "invite-code-created",
            performer: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Successfully created an invitation!", success: true, inviteCode: inviteCode });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
