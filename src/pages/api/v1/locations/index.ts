import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { name, description, organizationId } = req.body as {
      name: string;
      description: string;
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
    const locations = db.collection("locations");
    const organizations = db.collection("organizations");

    let organization = await organizations.findOne({
      id: organizationId,
    });

    if (!organization) {
      return res
        .status(404)
        .json({ message: `Organization not found (${organizationId})` });
    }

    // Check if user is a member of the organization and has permission to create a location
    if (!organization.members[uid]) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (organization.members[uid].role < 2) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Character limits
    if (name !== undefined) {
      name = name.trim();
      if (name.length > 32 || name.length < 3) {
        return res.status(400).json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (description !== undefined) {
      description = description.trim();
      if (description.length >= 256) {
        return res.status(400).json({
          message: "Description must be less than or equal to 256 characters.",
        });
      }
    }

    // Creating a new location
    const time = new Date();
    const timestamp = time.getTime();
    const uuid = uuidv4();

    await locations.insertOne({
      id: uuid,
      name: name,
      description: "",
      tags: [],
      organizationId: organizationId,
      avatar: null,
      roblox: {
        placeId: null,
      },
      enabled: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location_created",
            performer: uid,
            timestamp: timestamp,
            locationId: uuid,
          },
        },
      }
    );

    return res
      .status(200)
      .json({
        message: "Successfully created a location!",
        success: true,
        locationId: uuid,
      });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
