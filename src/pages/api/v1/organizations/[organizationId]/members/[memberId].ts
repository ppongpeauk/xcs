import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId, memberId } = req.query as {
    organizationId: string;
    memberId: string;
  };

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
  const users = db.collection("users");

  let organization = (await organizations.findOne({
    id: organizationId,
  })) as any;

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await users.findOne({ id: memberId });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const timestamp = new Date();

  if (!organization.members[memberId]) {
    return res.status(404).json({ message: "User not found in organization." });
  }

  if (organization.members[memberId].role >= 3) {
    return res.status(403).json({
      message: "User is the owner of the organization.",
      success: false,
    });
  }

  // Edit Member
  if (req.method === "PATCH") {
    let { role } = req.body as { role: number };
    role = parseInt(role.toString());

    if (organization.members[uid].role < 3) {
      return res.status(403).json({
        message: "You don't have edit permissions.",
        success: false,
      });
    }

    if (role === 3) {
      return res.status(403).json({
        message: "You cannot grant ownership.",
        success: false,
      });
    }

    if (organization.members[memberId].role > organization.members[uid].role) {
      return res.status(403).json({
        message: "You cannot edit a user with a higher role than you.",
        success: false,
      });
    }


    organizations.updateOne(
      { id: organizationId },
      {
        $set: {
          [`members.${memberId}.role`]: role,
        },
      }
    );

    // Log
    await organizations.updateOne(
      { id: organizationId },
      {
        $push: {
          logs: {
            type: "member-edited",
            performer: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully edited ${user?.displayName}'s role.`,
    });
  }

  // Remove From Organization
  if (req.method === "DELETE") {
    if (organization.members[memberId].role > organization.members[uid].role) {
      return res.status(403).json({
        message: "You cannot remove a user with a higher role than you.",
        success: false,
      });
    }

    // Kick From Organization
    await organizations.updateOne(
      { id: organizationId },
      {
        $unset: {
          [`members.${memberId}`]: "",
        },
      }
    );

    // Log
    await organizations.updateOne(
      { id: organizationId },
      {
        $push: {
          logs: {
            type: "member-removed",
            performer: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    return res
      .status(200)
      .json({
        message: `Successfully removed ${user?.displayName} from the organization.`,
        success: true,
      });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
