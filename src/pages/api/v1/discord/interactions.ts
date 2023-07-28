import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
const nacl = require("tweetnacl");

const publicKey = process.env.DISCORD_PUBLIC_KEY as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: NodeJS.ReadableStream) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db();

    const signature = req.headers["X-Signature-Ed25519"] as any;
    const timestamp = req.headers["X-Signature-Timestamp"] as any;
    const rawBody = await getRawBody(req);
    const interaction = JSON.parse(Buffer.from(rawBody).toString("utf8"));

    if (!signature || !timestamp) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + rawBody),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex')
    );
    
    if (!isVerified) {
      return res.status(401).end("Invalid request signature.");
    }    

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
