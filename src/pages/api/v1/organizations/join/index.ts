import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

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
  const organizations = db.collection("organizations");
  const invitations = db.collection("invitations");

  // Joining an organization with an invite code
  if (req.method === "POST") {
    let { inviteCode } = req.body as {
      inviteCode: string;
    };

    if (inviteCode !== undefined) {
      inviteCode = inviteCode.trim();
    }

    const inviteCodeData = await invitations.findOne({
      inviteCode: inviteCode,
    });

    if (!inviteCodeData) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid invite code.",
      });
    }

    const organization = await organizations.findOne({
      id: inviteCodeData.organizationId,
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid invite code.",
      });
    }

    // Check if the user is already in the organization
    if (organization.members[uid]) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "You are already in this organization.",
      });
    }

    const time = new Date();
    const timestamp = time.getTime();

    // Log the user joining
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "user-joined",
            performer: inviteCodeData.creatorId,
            target: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    // Join the organization and remove the invite code
    await organizations.updateOne(
      { id: organization.id },
      {
        $set: {
          [`members.${uid}`]: {
            role: inviteCodeData.role || 1,
            clearances: [],
            joined: new Date().getTime(),
          },
        },
      }
    );

    // Remove the invite code if it's single use
    if (inviteCodeData.singleUse) {
      await invitations.deleteOne({ inviteCode: inviteCode });
    }

    return res.status(200).json({
      message: `Successfully joined ${organization.name}!`,
      success: true,
      organizationId: organization.id,
    });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}