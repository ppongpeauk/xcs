import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Invitation ID
  const { invitationId } = req.query as { invitationId: string };

  // Authorization Header
  // const authHeader = req.headers.authorization;

  // Bearer Token
  // const token = authHeader?.split(" ")[1];

  // Verify Token
  // const uid = await tokenToID(token as string);
  // if (!uid) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const invitations = db.collection("invitations");
  const organizations = db.collection("organizations");
  const users = db.collection("users");

  let invitation = (await invitations.findOne({
    inviteCode: invitationId,
  })) as any;
  if (!invitation) {
    return res
      .status(404)
      .json({ valid: false, message: "Invitation not found" });
  }

  let creator = (await users.findOne(
    { id: invitation.fromId },
    {
      projection: { id: 1, username: 1, name: 1, avatar: 1 },
    }
  )) as any;
  if (!creator) {
    return res.status(404).json({ valid: false, message: "Creator not found" });
  }

  // Fetching Location Data
  if (req.method === "GET") {
    invitation.from = creator;
    if (invitation?.type === "organization") {
      let organization = (await organizations.findOne(
        {
          id: invitation.organizationId,
        },
        { projection: { id: 1, name: 1 } }
      )) as any;
      if (!organization) {
        return res
          .status(404)
          .json({ valid: false, message: "Organization not found" });
      }
      invitation.organization = organization;
    }
    return res.status(200).json({ invitation: invitation });
  }

  // Updating Location Data
  // if (req.method === "PUT") {
  //   if (!req.body) {
  //     return res.status(400).json({ message: "No body provided" });
  //   }

  //   let body = req.body as any;

  //   // Character limits
  //   if (body.name !== undefined) {
  //     body.name = body.name.trim();
  //     if (body.name.length > 32 || body.name.length < 3) {
  //       return res
  //         .status(400)
  //         .json({ message: "Name must be between 3-32 characters." });
  //     }
  //   }

  //   if (body.description) {
  //     body.description = body.description.trim();
  //     if (body.description.length > 256) {
  //       return res
  //         .status(400)
  //         .json({ message: "Description must be less than 256 characters." });
  //     }
  //   }

  //   if (
  //     location.roblox.placeId !== null &&
  //     location.roblox.placeId != body.roblox.placeId
  //   ) {
  //     return res
  //       .status(400)
  //       .json({ message: "You cannot change the experience ID once set." });
  //   }

  //   const time = new Date();
  //   const timestamp = time.getTime();

  //   body.updatedAt = timestamp;

  //   await locations.updateOne({ id: locationId }, { $set: body });
  //   await organizations.updateOne(
  //     { id: organization.id },
  //     {
  //       $push: {
  //         logs: {
  //           type: "location-updated",
  //           performer: uid,
  //           timestamp: timestamp,
  //           location: locationId,
  //           data: body,
  //         },
  //       },
  //     }
  //   );
  //   return res
  //     .status(200)
  //     .json({ message: "Successfully updated location!", success: true });
  // }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
