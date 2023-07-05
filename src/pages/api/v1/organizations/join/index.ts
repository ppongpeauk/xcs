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

  // Invite Code Validation
  if (req.method === "GET") {
    let { inviteCode } = req.query as {
      inviteCode: string;
    };

    if (inviteCode !== undefined) {
      inviteCode = inviteCode.trim();
    }

    const organization = await organizations.findOne({
      "invitations.codes": {
        $elemMatch: {
          code: inviteCode,
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid invite code.",
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      message: "Invite code is valid.",
      organizationId: organization.id,
    });
  }

  // Joining an organization with an invite code
  if (req.method === "POST") {
    let { inviteCode } = req.body as {
      inviteCode: string;
    };

    if (inviteCode !== undefined) {
      inviteCode = inviteCode.trim();
    }

    const organization = await organizations.findOne({
      "invitations.codes": {
        $elemMatch: {
          code: inviteCode,
        },
      },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid invite code.",
      });
    }

    // Get the invite code object
    const inviteCodeServerData = organization.invitations.codes.find(
      (code: any) => code.code === inviteCode
    );

    // Creating a new organization
    const time = new Date();
    const timestamp = time.getTime();

    // Log the user joining
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "user-joined",
            performer: uid,
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
            role: inviteCodeServerData.role || 1,
            clearances: [],
            joined: new Date().getTime(),
          },
        },
        $pull: {
          "invitations.codes": {
            code: inviteCode,
          },
        },
      }
    );

    return res.status(200).json({
      message: "Successfully joined!",
      success: true,
      organizationId: organization.id,
    });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
