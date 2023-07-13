import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // roblox-side
  console.log(req.method);
  if (req.method === "POST") {
    const { code } = req.query; // verification code from website
    const { robloxId } = req.body; // roblox id from roblox

    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB as string);
    const codes = db.collection("verificationCodes");
    const users = db.collection("users");

    const fetchCode = await codes.findOne(
      { code: code },
    );
    
    if (fetchCode) {
      // fetch user's roblox username
      const username = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users/${robloxId}`
      )
        .then((res) => res.json())
        .then((json) => json?.name);

      if (!username) {
        return res.status(404).json({
          success: false,
          message: "Roblox user not found.",
        });
      }

      // locate any users that have the same roblox id and revoke their verification
      await users.updateMany(
        { "roblox.id": robloxId },
        {
          $set: {
            roblox: {
              username: "",
              id: "",
              verified: false,
            },
          },
        }
      );

      // update user's verification
      await users.updateOne(
        { id: fetchCode.id },
        {
          $set: {
            roblox: {
              username: username,
              id: robloxId,
              verified: true,
            },
          },
        }
      );

      // revoke code
      await codes.deleteOne({ code: code });
      return res
        .status(200)
        .json({ success: true, message: "Successfully verified." });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Code not found." });
    }
  } else if (req.method === "GET") {
    res.status(200).json({ response: "ok" });
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
