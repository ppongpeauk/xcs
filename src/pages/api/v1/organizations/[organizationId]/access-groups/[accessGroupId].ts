import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId, accessGroupId } = req.query as {
    organizationId: string;
    accessGroupId: string;
  };

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
  const users = db.collection("users");

  let organization = (await organizations.findOne({
    id: organizationId,
  })) as any;

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid]) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await users.findOne({ id: uid });

  const timestamp = new Date();
  let { name, scanData } = req.body as {
    name: string;
    scanData: string;
  };

  // Edit Access Group
  if (req.method === "PATCH") {
    if (organization.members[uid].role < 3) {
      return res.status(403).json({
        message: "You don't have edit permissions.",
        success: false,
      });
    }

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    } else {
      name = name.trim();
      if (name.length > 32 || name.length < 1) {
        return res
          .status(400)
          .json({ message: "Name must be between 1-32 characters." });
      }

      // check if name is unique, except for the current access group
      const accessGroupNames = Object.values(organization.accessGroups).map(
        (accessGroup: any) => accessGroup.name.toLowerCase()
      );
      if (
        accessGroupNames.includes(name.toLowerCase()) &&
        organization.accessGroups[accessGroupId].name.toLowerCase() !==
          name.toLowerCase()
      ) {
        return res.status(400).json({ message: "Name must be unique." });
      }
    }

    organizations.updateOne(
      { id: organizationId },
      {
        $set: {
          [`accessGroups.${accessGroupId}.name`]: name,
          [`accessGroups.${accessGroupId}.scanData`]: scanData,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully saved changes.`,
      id: user?.id,
    });
  }

  if (req.method === "DELETE") {
    if (organization.members[uid].role < 2) {
      return res.status(403).json({
        message: "You don't have edit permissions.",
        success: false,
      });
    }

    await organizations.updateOne(
      { id: organizationId },
      {
        $unset: {
          [`accessGroups.${accessGroupId}`]: "",
        },
      }
    );

    return res.status(200).json({
      message: "Successfully deleted access group.",
      success: true,
    });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
