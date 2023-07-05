import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { generate as generateString } from "randomstring";
import { v4 as uuidv4 } from "uuid";

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

    // Check if user has less than 1 organization owned
    const ownedOrganizations = await organizations
      .find({
        [`members.${uid}.role`]: 3,
      })
      .toArray();

    if (ownedOrganizations.length >= 2) {
      return res
        .status(403)
        .json({
          message:
            "You have reached the maximum amount of organizations you can own. Upgrade your account to create more organizations.",
        });
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

    // Creating a new organization
    const time = new Date();
    const timestamp = time.getTime();
    const id = uuidv4();
    // const id = generateString({
    //   length: 24,
    //   charset: "alphanumeric",
    // }).toLowerCase();

    await organizations.insertOne({
      id: id,
      isPersonal: false,
      name: name,
      description: "",
      members: {
        [uid]: {
          role: 3,
          clearances: [],
          joinedAt: timestamp,
        },
      },
      clearances: {},
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
