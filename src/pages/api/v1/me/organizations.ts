import { authToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    console.log(req.method);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const uid = await authToken(req);
  if (!uid) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB as string);
  let organizations = await db
    .collection("organizations")
    .find(
      { [`members.${uid}`]: { $exists: true } },
      { projection: { id: 1, name: 1, description: 1, avatar: 1, members: 1 } }
    )
    .toArray();

  organizations = await Promise.all(
    organizations.map(async (organization) => {
      let ownerId = Object.keys(organization.members).find(
        (member) => organization.members[member].role === 3
      );
      let owner = await db
        .collection("users")
        .findOne(
          { id: ownerId },
          { projection: { id: 1, displayName: 1, username: 1, avatar: 1 } }
        );

      return { ...organization, owner };
    })
  );

  res.status(200).json({ organizations: organizations });
}
