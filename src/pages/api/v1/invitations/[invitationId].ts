import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { invitationId } = req.query as { invitationId: string };

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
      .json({ valid: false, message: "Invitation not found." });
  }

  let creator = (await users.findOne(
    { id: invitation.fromId },
    {
      projection: { id: 1, username: 1, name: 1, avatar: 1, displayName: 1 },
    }
  )) as any;
  if (!creator) {
    return res.status(404).json({ valid: false, message: "Creator not found." });
  }

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
          .json({ valid: false, message: "Organization not found." });
      }
      invitation.organization = organization;
    } else if (invitation?.type === "xcs") {
      if (invitation.uses >= invitation.maxUses) {
        // await invitations.deleteOne({ inviteCode: invitationId });
        return res.status(404).json({
          valid: false,
          message: "This invitation has reached its maximum uses.",
        });
      }
    }
    return res.status(200).json({ invitation: invitation });
  }

  return res.status(500).json({ message: "An unknown error has occurred." });
}
