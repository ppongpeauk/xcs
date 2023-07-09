import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { generate as generateString } from "randomstring";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // roblox-side, generate a code for the user.
  if (req.method === "GET") {
    const { id } = req.query; // roblox id

    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB as string);
    const codes = db.collection("verificationCodes");

    const fetchCode = await codes.findOne({ robloxId: id }, { projection: { code: 1 } });

    // verify roblox id on roblox
    const verifyRobloxId = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users/${id}`);
    if (verifyRobloxId.status !== 200) {
      return res.status(404).json({ success: false, message: "User ID not found on Roblox." });
    }
    
    // if a code already exists, return it
    if (fetchCode) {
      return res.status(200).json({ success: true, code: fetchCode.code });
    } else {
      // create a new code if one doesn't already exist, and make sure it's unique
      let new_code = null;
      do {
        new_code = await generateString({ length: 6, readable: true, charset: "alphanumeric", capitalization: "uppercase" });
      } while (await codes.findOne({ code: new_code }, { projection: { _id: 1 } }));

      await codes.insertOne({ robloxId: id, code: new_code, createdAt: new Date().getTime() });
      res.status(200).json({ success: true, code: new_code });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
