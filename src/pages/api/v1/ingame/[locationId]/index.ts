import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { locationId } = req.query;
  const { apiKey="fbcd7418355042c7b6101b7b2eaf1dd6" } = req.body;

  const mongoClient = await clientPromise;

  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const dbAccessPoints = db.collection("accessPoints");
  const dbLocations = db.collection("locations");
  const dbOrganizations = db.collection("organizations");

  // check if API key is empty
  if (!apiKey) {
    return res.status(401).json({ success: false, message: "No API key provided" });
  }

  // get location
  const location = await dbLocations.findOne({ id: locationId });
  if (!location) {
    return res.status(404).json({ success: false, message: "Location not found" });
  }

  // get organization
  const organization = await dbOrganizations.findOne({
    id: location.organizationId,
  });
  if (!organization) {
    return res.status(404).json({ success: false, message: "Organization not found" });
  }

  // check API key
  if (!(apiKey in organization.apiKeys)) {
    return res.status(401).json({ success: false, message: "Invalid API key" });
  }

  // get access points
  const accessPoints = await dbAccessPoints.find({ locationId }, { projection: { _id: 0 }}).toArray();
  
  return res.status(200).json({ success: true, accessPoints: accessPoints });
}