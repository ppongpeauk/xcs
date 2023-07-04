import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Location ID
  const { locationId } = req.query as { locationId: string };

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

  let location = (await locations.findOne({ id: locationId })) as any;
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  let organization = await organizations.findOne({
    id: location.organizationId,
  });
  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid as any]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetching Location Data
  if (req.method === "GET") {
    return res.status(200).json({ location: location });
  }

  // Updating Location Data
  if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let body = req.body as any;

    // Character limits
    if (body.name !== undefined) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res.status(400).json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (body.description.length > 256) {
        return res.status(400).json({ message: "Description must be less than 256 characters." });
      }
    }

    if (
      location.roblox.placeId !== null &&
      location.roblox.placeId != body.roblox.placeId
    ) {
      return res
        .status(400)
        .json({ message: "You cannot change the experience ID once set." });
    }

    const time = new Date();
    const timestamp = time.getTime();

    body.updatedAt = timestamp;

    await locations.updateOne({ id: locationId }, { $set: body });
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location-updated",
            performer: uid,
            timestamp: timestamp,
            location: locationId,
            data: body,
          },
        },
      }
    );
    return res
      .status(200)
      .json({ message: "Successfully updated location!", success: true });
  }

  // Deleting Location Data
  if (req.method === "DELETE") {
    const time = new Date();
    const timestamp = time.getTime();
    
    // Delete Location
    await locations.deleteOne({ id: locationId });

    // Delete all API keys for this location
    await organizations.updateOne(
      { id: organization.id },
      { $unset: { apiKeys: { locationId: locationId } } }
    );

    // Log Deletion
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location_deleted",
            performer: uid,
            timestamp: timestamp,
            locationId: locationId,
          },
        },
      }
    );
    
    return res
      .status(200)
      .json({ message: "Successfully deleted location!", success: true });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
