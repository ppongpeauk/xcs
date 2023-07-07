import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

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
  const organizations = db.collection("organizations");
  const locations = db.collection("locations");
  const accessPoints = db.collection("accessPoints");

  let location = (await locations.findOne({ id: locationId })) as any;
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  let accessPointsData = (await accessPoints
    .find({ locationId: locationId })
    .toArray()) as any;
  if (!accessPointsData) {
    return res.status(404).json({ message: "Access Points not found" });
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

  if (req.method === "GET") {
    return res
      .status(200)
      .json({
        accessPoints: accessPointsData,
        self: organization.members[uid as any],
      });
  }

  if (req.method === "POST") {
    if (member.role <= 2) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create Access Point
    const time = new Date();
    const timestamp = time.getTime();
    const id = uuidv4();
    // const id = generateString({
    //   length: 24,
    //   charset: "alphanumeric",
    // }).toLowerCase();

    let { name, description } = req.body as {
      name: string;
      description: string;
    };

    // Character limits
    if (name !== undefined) {
      name = name.trim();
      if (name.length > 32 || name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
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

    const accessPoint = {
      id: id,
      name: name,
      description: description,
      locationId: locationId,
      configuration: {
        enabled: true,
        armed: true,
        timedAccess: {
          routines: [],
          temporaryAccess: [],
        },
        alwaysAllowed: {
          clearances: [],
          users: [],
        },
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: uid,
    };

    await accessPoints.insertOne(accessPoint);

    return res
      .status(200)
      .json({
        message: "Access point created successfully!",
        accessPointId: id,
      });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
