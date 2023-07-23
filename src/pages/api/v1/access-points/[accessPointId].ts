import clientPromise from "@/lib/mongodb";
import { getRobloxUsers } from "@/lib/utils";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Access Point ID
  const { accessPointId } = req.query as { accessPointId: string };

  // Authorization Header
  const authHeader = req.headers.authorization;

  // Bearer Token
  const token = authHeader?.split(" ")[1];

  // Verify Token
  const uid = await tokenToID(token as string);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const locations = db.collection("locations");
  const organizations = db.collection("organizations");
  const accessPoints = db.collection("accessPoints");
  const users = db.collection("users");

  let accessPoint = (await accessPoints.findOne({ id: accessPointId })) as any;

  if (!accessPoint) {
    return res.status(404).json({ message: "Access point not found." });
  }

  let organization = await organizations.findOne(
    {
      id: accessPoint.organizationId,
    },
    {
      projection: {
        id: 1,
        name: 1,
        members: 1,
        accessGroups: 1,
      },
    }
  );

  if (!organization) {
    return res.status(404).json({ message: "Organization not found." });
  }

  let member = organization.members[uid as any];
  if (!member) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Fetching Access Point Data
  if (req.method === "GET") {
    // Get User Permissions
    let out = {
      accessPoint: accessPoint,
    };
    out.accessPoint.organization = organization;
    delete out.accessPoint.organization.invitations;
    out.accessPoint.location = await locations.findOne({
      id: accessPoint.locationId,
    });

    const regularMembers = Object.keys(
      organization.members
    ).filter((member) => {
      if (organization?.members[member].type !== "roblox") {
        return member;
      }
    });
    
    const robloxMembers = Object.keys(
      organization.members
    ).filter((member) => {
      if (organization?.members[member].type === "roblox") {
        return member;
      }
    });

    await regularMembers.forEach(async (member) => {
      const user = await users
        .findOne(
          { id: member },
          { projection: { id: 1, displayName: 1, username: 1 } }
        )
        .then((res) => res);
      out.accessPoint.organization.members[member] = {
        ...out.accessPoint.organization.members[member],
        displayName: user?.displayName,
        username: user?.username,
      };
    });

    // fetch roblox display names and usernames
    const robloxUsers = await getRobloxUsers(robloxMembers);

    await Object.entries(robloxUsers).map(async ([id, data]: any) => {
      out.accessPoint.organization.members[id] = {
        ...out.accessPoint.organization.members[id],
        displayName: data.displayName,
        username: data.name,
      };
    });

    out.accessPoint.self = organization.members[uid as any];
    return res.status(200).json(out);
  }

  // Updating Data
  if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({ message: "No body provided" });
    }

    let body = req.body as any;

    // Character limits
    if (body.name !== undefined) {
      body.name = body.name.trim();
      if (member.role <= 1 && body.name !== accessPoint.name) {
        return res.status(401).json({ message: "Unauthorized." });
      }
      if (body.name.length > 32 || body.name.length < 1) {
        return res
          .status(400)
          .json({ message: "Name must be between 1-32 characters." });
      }
    }

    if (body.description) {
      body.description = body.description.trim();
      if (member.role <= 1 && body.description !== accessPoint.description) {
        return res.status(401).json({ message: "Unauthorized." });
      }
      if (body.description.length > 256) {
        return res
          .status(400)
          .json({ message: "Description must be less than 256 characters." });
      }
    }

    if (body.config?.unlockTime) {
      try {
        body.config.unlockTime = parseInt(body.config.unlockTime);
      }
      catch {
        return res.status(400).json({ message: "Invalid unlock time." });
      }
    }

    const timestamp = new Date();

    body.updatedAt = timestamp;

    await accessPoints.updateOne(
      { id: accessPoint.id },
      {
        $set: {
          name: body.name,
          description: body.description,
          updatedAt: timestamp,
          config: body.config,
        },
      }
    );
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "access-point-updated",
            performer: uid,
            timestamp: timestamp,
            accessPoint: accessPoint.id,
            data: body,
          },
        },
      }
    );
    return res
      .status(200)
      .json({ message: "Successfully updated access point!", success: true });
  }

  // Deleting Location Data
  if (req.method === "DELETE") {
    const timestamp = new Date();

    // Delete Access Point
    await accessPoints.deleteOne({ id: accessPointId });

    // Log Deletion
    await organizations.updateOne(
      { id: organization.id },
      {
        $push: {
          logs: {
            type: "location_deleted",
            performer: uid,
            timestamp: timestamp,
            accessPointId: accessPoint.id,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ message: "Successfully deleted access point!", success: true });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
