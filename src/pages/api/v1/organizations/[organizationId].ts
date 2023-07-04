import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId } = req.query as { organizationId: string };

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
  let organization = (await organizations
    .find({ id: organizationId })
    .toArray()) as any;

  if (organization.length == 0) {
    return res.status(404).json({ message: "Organization not found" });
  }

  organization = organization[0];

  if (!organization.members[uid]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    return res.status(200).json({
      organization: organization,
    });
  }

  // Updating Location Data
  if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let body = req.body as any;
    delete body.logs; // Prevent logs from being tampered

    // Character limits

    if (body.name) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (body.description.length >= 256) {
        return res
          .status(400)
          .json({
            message: "Description must be less than or equal to 256 characters.",
          });
      }
    }

    const time = new Date();
    const timestamp = time.getTime();

    body.lastUpdatedDate = timestamp;

    await organizations.updateOne({ id: organizationId }, { $set: body });
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "organization-updated",
            performer: uid,
            timestamp: timestamp,
            data: body,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Successfully updated organization!", success: true });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
