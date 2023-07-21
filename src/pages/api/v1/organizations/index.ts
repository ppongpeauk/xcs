import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { generate as generateString } from "randomstring";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { name } = req.body as {
      name: string;
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
    const users = db.collection("users");
    const user = await users.findOne(
      { id: uid },
      { projection: { id: 1, platform: 1, roblox: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.roblox.verified) {
      return res.status(403).json({
        message:
          "You must link your Roblox account before creating an organization.",
      });
    }

    // Check if user has less than 1 organization owned
    const ownedOrganizations = await organizations
      .find({
        [`members.${uid}.role`]: 3,
      })
      .toArray();

    const capError = () => {
      return res.status(403).json({
        message:
          "You have reached the maximum amount of organizations you can own. Upgrade your account to create more organizations.",
      });
    };

    let organizationLimit = 1;
    switch (user.platform.membership) {
      case 0:
        organizationLimit = 1;
        break;
      case 1:
        organizationLimit = 8;
        break;
      case 2:
        organizationLimit = 24;
        break;
      case 3:
        organizationLimit = -1;
        break;
      default:
        organizationLimit = 1;
    }

    if (ownedOrganizations.length >= organizationLimit) {
      return capError();
    }

    // Character limits
    if (name !== undefined) {
      name = name.trim();
      if (name.length > 32 || name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
      }
    }

    // Check if name is taken
    if (name) {
      const checkName = await organizations.findOne(
        {
          name: { $regex: new RegExp(`^${name}$`, "i") },
        },
        { projection: { _id: 1 } }
      );
      if (checkName) {
        return res.status(400).json({ message: "This name is taken. Please choose another." });
      }
    }

    // Creating a new organization
    const timestamp = new Date();
    // const id = uuidv4();
    const id = generateString({
      length: 16,
      charset: "alphanumeric",
      capitalization: "lowercase",
    });

    await organizations.insertOne({
      id: id,
      isPersonal: false,
      name: name,
      description: "",
      avatar: "",
      members: {
        [uid]: {
          type: "user",
          id: uid,
          role: 3,
          accessGroups: [],
          joinedAt: timestamp,
        },
      },
      accessGroups: {},
      invitations: [],
      logs: [],
      apiKeys: {},
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await organizations.updateOne(
      { id: id },
      {
        $push: {
          logs: {
            type: "organization-created",
            performer: uid,
            timestamp: timestamp,
          },
        },
      }
    );

    return res.status(200).json({
      message: "Successfully created an organization!",
      success: true,
      organizationId: id,
    });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
