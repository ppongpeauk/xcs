import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Organization ID
  const { organizationId } = req.query as { organizationId: string };

  if (req.method !== "GET") {
    console.log(req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Authorization Header
  const authHeader = req.headers.authorization;

  // Bearer Token
  const token = authHeader?.split(" ")[1];

  // Verify Token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Get Locations from Database by Organization ID
  // TODO: Implement this
  // Dummy database

  const db = {
    "1": [
      {
        id: "1",
        name: "Location 1",
        organizationId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  } as any;

  function getLocations(organizationId: string) {
    return db[organizationId] || [];
  }

  res.status(200).json({ locations: getLocations(organizationId) });
}
