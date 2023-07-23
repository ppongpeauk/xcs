import { authToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getRobloxUsersByUsernames } from "@/lib/utils";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId } = req.query as {
    organizationId: string;
  };

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
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
    return res.status(401).json({ message: "Unauthorized." });
  }

  const timestamp = new Date();
  let { username, accessGroups } = req.body as {
    username?: string;
    accessGroups: string[];
  };

  if (!username?.trim()) {
    return res.status(400).json({
      message: "Missing username.",
      success: false,
    });
  }

  // get roblox username
  let robloxUsers = await getRobloxUsersByUsernames([username as string]) as unknown as any[];

  if (!robloxUsers.length) {
    return res.status(404).json({ message: "Roblox user not found." });
  }

  const robloxId = robloxUsers[0].id;
  const user = await users.findOne({ "roblox.id": robloxId.toString() });
  

  if (req.method === "POST") {
    if (organization.members[uid].role < 2) {
      return res.status(403).json({
        message: "You don't have edit permissions.",
        success: false,
      });
    }

    if (user) {
      return res.status(409).json({
        message: "An account with this Roblox ID already exists. Please send them an invitation instead.",
        success: false,
      });
    }

    if (organization.members[robloxId]) {
      return res.status(409).json({
        message: "This user is already in the organization.",
        success: false,
      });
    }

    organizations.updateOne(
      { id: organizationId },
      {
        $set: {
          [`members.${robloxId}`]: {
            type: "roblox",
            id: robloxId,
            accessGroups: accessGroups,
            role: 0,
            joinedAt: timestamp,
          }
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully added ${robloxUsers[0].name} to the organization.`,
    });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
