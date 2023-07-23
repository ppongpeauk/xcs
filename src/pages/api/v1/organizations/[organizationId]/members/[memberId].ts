import { authToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Organization ID
  const { organizationId, memberId } = req.query as {
    organizationId: string;
    memberId: string;
  };

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
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
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = await users.findOne({ id: memberId });
  // if (!user) {
  //   return res.status(404).json({ message: "User not found." });
  // }

  const timestamp = new Date();
  let { role, accessGroups, scanData } = req.body as {
    role: number;
    accessGroups: string[];
    scanData: string;
  };

  if (
    role !== organization.members[memberId].role &&
    organization.members[memberId].role >= 3
  ) {
    return res.status(403).json({
      message: "User is the owner of the organization.",
      success: false,
    });
  }

  // Edit Member
  if (req.method === "PATCH") {
    role = parseInt(role.toString());

    if (organization.members[uid].role < 2) {
      return res.status(403).json({
        message: "You don't have edit permissions.",
        success: false,
      });
    }

    if (role !== organization.members[memberId].role && role === 3) {
      return res.status(403).json({
        message: "You cannot grant ownership.",
        success: false,
      });
    }

    if (organization.members[memberId].role > organization.members[uid].role) {
      return res.status(403).json({
        message: "You cannot edit a user with a higher role than you.",
        success: false,
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
          [`members.${memberId}.role`]: role,
          [`members.${memberId}.accessGroups`]: accessGroups,
          [`members.${memberId}.scanData`]: scanData || {},
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully saved changes.`,
      id: user?.id,
    });
  }

  // Remove From Organization
  if (req.method === "DELETE") {
    if (organization.members[memberId].type !== "roblox") {
      if (
        organization.members[memberId].role >= organization.members[uid].role
      ) {
        return res.status(403).json({
          message: "You cannot remove a user with an equal or higher role than you.",
          success: false,
        });
      }

      // Kick From Organization
      await organizations.updateOne(
        { id: organizationId },
        {
          $unset: {
            [`members.${memberId}`]: "",
          },
        }
      );

      return res.status(200).json({
        message: `Successfully removed ${user?.displayName} from the organization.`,
        success: true,
      });
    } else {

      let robloxUser = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users/${memberId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json())
      
      const robloxUsername = robloxUser.name;
      
      // Kick From Organization
      await organizations.updateOne(
        { id: organizationId },
        {
          $unset: {
            [`members.${memberId}`]: "",
          },
        }
      );

      return res.status(200).json({
        message: `Successfully removed ${robloxUsername} from the organization.`,
        success: true,
      });
    }
  }

  return res.status(500).json({ message: "An unknown errror occurred." });
}
