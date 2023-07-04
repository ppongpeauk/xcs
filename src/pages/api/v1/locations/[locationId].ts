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
  const uid = tokenToID(token as string);
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

    const body = req.body as any;

    if (
      location.roblox.experienceId !== null &&
      body.experienceId != null &&
      location.roblox.experienceId != body.experienceId
    ) {
      console.log("experience id immutable");
      return res
        .status(400)
        .json({ message: "experience id immutable after setup" });
    }

    const time = new Date();
    const timestamp = time.getTime();

    body.lastUpdatedDate = timestamp;

    await locations.updateOne({ id: locationId }, { $set: body });
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location_updated",
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
      .json({ message: "successfully updated", success: true });
  }

  return res.status(500).json({ message: "Hello World" });
}
