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
  const accessPoints = db.collection("accessPoints");

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

  let member = organization.members[uid as any];
  if (!member) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Append Organization Data to Location
  location.organization = organization;
  delete location.organization.invitations;

  // Fetching Location Data
  if (req.method === "GET") {
    // Get User Permissions
    location.self = organization.members[uid as any];
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
      if (member.role <= 2 && body.name !== location.name) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (body.name.length > 32 || body.name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (member.role <= 2 && body.description !== location.description) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (body.description.length > 256) {
        return res
          .status(400)
          .json({ message: "Description must be less than 256 characters." });
      }
    }

    if (
      location.roblox.universe.id !== null &&
      location.roblox.universe.id != body.roblox.universe.id
    ) {
      return res
        .status(400)
        .json({ message: "You cannot change the universe ID once set." });
    }

    if (body.roblox.universe.id) {
      body.roblox.universe.id = body.roblox.universe.id.trim();
      if (
        member.role <= 2 &&
        body.roblox.universe.id !== location.roblox.universe.id
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    // fetch experience details
    const robloxResponse = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/games/v1/games?universeIds=${body.roblox.universe.id || location.roblox.universe.id}`
    ).then((res) => res.json()).then((res) => res.data);

    if (robloxResponse.length === 0) {
      return res.status(400).json({ message: "Invalid universe ID." });
    }

    const place = robloxResponse[0];
    body.roblox.place = place;

    const thumbnailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/thumbnails/v1/games/icons?universeIds=${body.roblox.universe.id || location.roblox.universe.id}&returnPolicy=PlaceHolder&size=256x256&format=Jpeg&isCircular=false`
    ).then((res) => res.json()).then((res) => res.data);

    if (thumbnailResponse.length === 0) {
      body.roblox.place.thumbnail = null;
    } else {
      body.roblox.place.thumbnail = thumbnailResponse[0].imageUrl;
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

    // Delete API Keys
    const apiKeys = organization.apiKeys;
    for (const apiKeyId in apiKeys) {
      const apiKey = apiKeys[apiKeyId];
      if (apiKey.locationId === location.id) {
        await organizations.updateOne(
          { id: organization.id },
          { $unset: { [`apiKeys.${apiKeyId}`]: "" } }
        );
      }
    }

    // Delete Access Points
    await accessPoints.deleteMany({ locationId: locationId });

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
