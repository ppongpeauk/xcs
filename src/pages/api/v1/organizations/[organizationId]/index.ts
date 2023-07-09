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
  const locations = db.collection("locations");
  const invitations = db.collection("invitations");
  const accessPoints = db.collection("accessPoints");
  const users = db.collection("users");
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
    organization.user = organization.members[uid];

    // Find owner of organization
    for (const [key, value] of Object.entries(organization.members) as any) {
      if (value.role === 3) {
        let owner = await users.findOne({ id: key });
        organization.owner = owner;
        break;
      }
    }

    // Get all members
    let members = [];
    for (const [key, value] of Object.entries(organization.members) as any) {
      let member = await users.findOne(
        { id: key },
        { projection: { name: 1, username: 1, avatar: 1 } }
      );
      members.push({
        id: key,
        name: member?.name,
        username: member?.username,
        avatar: member?.avatar,
        ...value,
      });
      if (members.length > 99) break;
    }

    organization.members = members;

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

    // Character limits
    if (body.name !== undefined) {
      body.name = body.name.trim();
      if (body.name.length > 32 || body.name.length < 3) {
        return res
          .status(400)
          .json({ message: "Name must be between 3-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (body.description.length > 256) {
        return res
          .status(400)
          .json({ message: "Description must be less than 256 characters." });
      }
    }

    // Prevent values from being tampered with
    delete body.logs;
    delete body.id;
    delete body.apiKeys;
    delete body.members;
    // if (body.members[uid] && organization.members[uid].role < 3) {
    //   delete body.members;
    // }

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
        return res.status(400).json({
          message: "Description must be less than or equal to 256 characters.",
        });
      }
    }

    // Check if name is taken
    if (body.name) {
      const checkName = await organizations.findOne(
        {
          name: { $regex: new RegExp(`^${body.name}$`, "i") },
        },
        { projection: { id: 1 } }
      );
      if (checkName && checkName.id !== organization.id) {
        return res
          .status(400)
          .json({ message: "This name is taken. Please choose another." });
      }
    }

    const time = new Date();
    const timestamp = time.getTime();

    body.updatedAt = timestamp;

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

  // Deleting Organization Data
  if (req.method === "DELETE") {
    const time = new Date();
    const timestamp = time.getTime();

    // Delete Organization
    await organizations.deleteOne({ id: organizationId });

    // Delete All Locations in Organization
    await locations.deleteMany({ organizationId: organizationId });

    // Delete All Invitations in Organization
    await invitations.deleteMany({ organizationId: organizationId });

    // Delete All Access Points in Organization
    await accessPoints.deleteMany({ organizationId: organizationId });

    return res
      .status(200)
      .json({ message: "Successfully deleted organization!", success: true });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
