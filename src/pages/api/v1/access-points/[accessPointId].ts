import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Access Point ID
  const { accessPointId } = req.query as { accessPointId: string };

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

  let accessPoint = (await accessPoints.findOne({ id: accessPointId })) as any;

  if (!accessPoint) {
    return res.status(404).json({ message: "Access point not found." });
  }

  let organization = await organizations.findOne({
    id: accessPoint.organizationId,
  });

  if (!organization) {
    return res.status(404).json({ message: "Organization not found." });
  }

  let member = organization.members[uid as any];
  if (!member) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Fetching Access Point Data
  if (req.method === "GET") {
    // Get User Permissions
    let out = {
      accessPoint: accessPoint,
    }
    out.accessPoint.organization = organization;
    delete out.accessPoint.organization.invitations;
    out.accessPoint.location = await locations.findOne({ id: accessPoint.locationId });
    out.accessPoint.self = organization.members[uid as any];
    return res.status(200).json(out);
  }

  // Updating Data
  if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let body = req.body as any;

    // Character limits
    if (body.name !== undefined) {
      body.name = body.name.trim();
      if (member.role <= 1 && body.name !== accessPoint.name) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (body.name.length > 32 || body.name.length < 1) {
        return res
          .status(400)
          .json({ message: "Name must be between 1-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (member.role <= 1 && body.description !== accessPoint.description) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (body.description.length > 256) {
        return res
          .status(400)
          .json({ message: "Description must be less than 256 characters." });
      }
    }

    const time = new Date();
    const timestamp = time.getTime();

    body.updatedAt = timestamp;

    await accessPoints.updateOne({ id: accessPoint.id }, { $set: {
      name: body.name,
      description: body.description,
      updatedAt: timestamp,
      configuration: {
        active: body.active,
        armed: body.armed,
        timedAccess: body.timedAccess,
        alwaysAllowed: body.alwaysAllowed,
      }
    } });
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "access-point-updated",
            performer: uid,
            timestamp: timestamp,
            accessPoint: accessPoint.id,
            data: body,
          },
        },
      }
    );
    return res
      .status(200)
      .json({ message: "Successfully updated access point!", success: true });
  }

  // Deleting Location Data
  if (req.method === "DELETE") {
    const time = new Date();
    const timestamp = time.getTime();

    // Delete Access Point
    await accessPoints.deleteOne({ id: accessPointId });

    // Log Deletion
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location_deleted",
            performer: uid,
            timestamp: timestamp,
            accessPointId: accessPoint.id,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Successfully deleted access point!", success: true });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}