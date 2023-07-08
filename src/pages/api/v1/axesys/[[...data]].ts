import clientPromise from "@/lib/mongodb";
import { Location } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // reject non-GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // query parameters
  // /api/v1/axesys/syncdoorspremium/{apiKey}/{locationId}
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ error: "Missing data" });
  }

  console.log(`[AXESYS] /api/v1/axesys/syncdoorspremium/: ${data}`);

  let apiKey = data[0];
  let locationId = data[1];

  // create a connection to the database
  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const locations = db.collection("locations");
  const organizations = db.collection("organizations");
  const accessPoints = db.collection("accessPoints");

  // fetch location data
  let location = (await locations.findOne({
    id: locationId,
  })) as Location | null;

  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }

  // check if the API key is valid
  let organization = await organizations.findOne({
    id: location.organizationId,
    [`apiKeys.${apiKey}`]: { $exists: true },
  });
  if (!organization) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // create legacy response

  // get all access points
  let accessPointsData = await accessPoints
    .find({ locationId: location.id })
    .toArray();

  let legacyResponse = {} as any;
  for (let accessPoint of accessPointsData) {
    legacyResponse[accessPoint.id] = {
      DoorSettings: {
        DoorName: accessPoint.name,
        Active: accessPoint.configuration.active ? "1" : "0",
        Locked: accessPoint.configuration.armed ? "1" : "0",
        Timer: accessPoint.configuration.timer || 8,
      },
      AuthorizedUsers: {},
      AuthorizedGroups: {},
    };
    for (let user of accessPoint.configuration.alwaysAllowed.users) {
      legacyResponse[accessPoint.id].AuthorizedUsers[user.robloxId] = user.robloxUsername;
    }
    // TODO: add group support
  }

  console.log(legacyResponse);

  return res.status(200).json({
    query: {
      apiKey,
      locationId,
    },
    data: legacyResponse,
  });
}
