import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db();

    const interaction = req.body;

    if (interaction.type === 1) {
      return res.status(200).json({
        type: 1,
      });
    }

    if (interaction.type === 2) {
      const { name, options } = interaction.data;

      if (name === "ping") {
        return res.status(200).json({
          type: 4,
          data: {
            content: "Pong!",
          },
        });
      }
    }
  }

  return res.status(500).json({
    error: "Internal server error.",
  });
}
