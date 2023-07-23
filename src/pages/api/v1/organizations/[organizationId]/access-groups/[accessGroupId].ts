import { authToken } from "@/lib/auth";
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

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const organizations = db.collection("organizations");
  const locations = db.collection("locations");
  const accessPoints = db.collection("accessPoints");
  const users = db.collection("users");

  let organization = (await organizations.findOne({
    id: organizationId,
  })) as any;

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" });
  }

  if (!organization.members[uid]) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = await users.findOne({ id: uid });

  const timestamp = new Date();
  let { name, description, scanData, config } = req.body as any;

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

    description = description.trim();
    if (description.length > 128) {
      return res.status(400).json({
        message: "Description must be less than 128 characters.",
      });
    }

    try {
      scanData = JSON.parse(scanData);
    } catch (err) {
      return res.status(400).json({ message: "Unable to parse scan data. Check your JSON and try again." });
    }

    organizations.updateOne(
      { id: organizationId },
      {
        $set: {
          [`accessGroups.${accessGroupId}`]: {
            ...organization.accessGroups[accessGroupId],
            name,
            description,
            scanData,
            config,
            lastUpdated: timestamp,
          }
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

    // remove access group from the main document
    await organizations.updateOne(
      { id: organizationId },
      {
        $unset: {
          [`accessGroups.${accessGroupId}`]: "",
        },
      }
    );

    // remove access group from all access points and members
    await accessPoints.updateMany(
      { organizationId: organizationId },
      {
        $unset: {
          [`config.alwaysAllowed.accessGroups.${accessGroupId}`]: ""
        },
      }
    );

    // remove access group from all members in the organization, where the member.accessGroups array contains accessGroupId
    const members = Object.values(organization.members);
    for (let i = 0; i < members.length; i++) {
      const member = members[i] as any;
      const memberId = member.id || Object.keys(organization.members).find((key) => organization.members[key] === member);
      const memberAccessGroups = member.accessGroups;

      if (memberAccessGroups.includes(accessGroupId)) {
        console.log(`Removing access group ${accessGroupId} from member ${memberId}`);
        await organizations.updateOne(
          { id: organizationId },
          {
            $pull: {
              [`members.${memberId}.accessGroups`]: accessGroupId,
            },
          }
        );
      }
    }

    return res.status(200).json({
      message: "Successfully deleted access group.",
      success: true,
    });
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
