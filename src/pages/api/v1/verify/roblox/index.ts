import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import { generate as generateString } from "randomstring";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // server-side, validate code from the website.
  if (req.method === "POST") {
    const { code } = req.query; // verification code from website
    const authHeader = req.headers.authorization;

    // bearer token
    const token = authHeader?.split(" ")[1];

    // verify token
    const uid = await tokenToID(token as string);
    if (!uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB as string);
    const codes = db.collection("verificationCodes");
    const users = db.collection("users");

    const fetchCode = await codes.findOne({ code: code }, { projection: { robloxId: 1 } });
    if (fetchCode) {
      // fetch user's roblox username
      const username = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users/${fetchCode.robloxId}`)
        .then(res => res.json())
        .then(json => json.name);

      // locate any users that have the same roblox id and revoke their verification
      await users.updateMany({ "roblox.id": fetchCode.robloxId }, { $set: {
        roblox: {
          username: "",
          id: "",
          verified: false
        }
      }});

      // update user's verification
      await users.updateOne({ id: uid }, { $set: {
        roblox: {
          username: username,
          id: fetchCode.robloxId,
          verified: true
        }
      }});

      // revoke code
      await codes.deleteOne({ code: code });
      return res.status(200).json({ success: true, message: "Successfully verified." });
    } else {
      return res.status(404).json({ success: false, message: "Code not found." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
