import clientPromise from "@/lib/mongodb";
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

  const timestamp = new Date();
  let { username, accessGroups } = req.body as {
    username?: number;
    accessGroups: string[];
  };

  // get roblox username
  let robloxUsers = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/usernames/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernames: [username] }),
    })
    .then((res) => res.json())
    .then((json) => json.data);

  if (!robloxUsers.length) {
    return res.status(404).json({ message: "Roblox user not found." });
  }

  const robloxId = robloxUsers[0].id;
  const user = await users.findOne({ "roblox.id": robloxId });
  console.log(user);

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

    organizations.updateOne(
      { id: organizationId },
      {
        $set: {
          [`members.${robloxId}`]: {
            type: "roblox",
            id: robloxId,
            accessGroups: accessGroups,
            role: 0,
          }
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully added ${robloxUsers[0].username} to the organization.`,
    });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
