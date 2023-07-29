import clientPromise from "@/lib/mongodb";
import withDiscordInteraction from "@/middlewares/discord";
import { NextApiRequest, NextApiResponse } from "next";
const nacl = require("tweetnacl");

const publicKey = process.env.DISCORD_PUBLIC_KEY as string;
const BASE_RESPONSE = { type: 4 }
const INVALID_COMMAND_RESPONSE = { ...BASE_RESPONSE, data: { content: "Command not found." } }
const PING_COMMAND_RESPONSE = { ...BASE_RESPONSE, data: { content: "Pong!" } }

// disable body parsing, need the raw body as per https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (
  _: NextApiRequest,
  res: NextApiResponse,
  interaction: any
) => {
  const {
    data: { name, options },
  } = interaction;

  switch (name) {
    case "ping":
      return res.status(200).json(PING_COMMAND_RESPONSE);
    case "echo":
      return res.status(200).json({
        ...BASE_RESPONSE,
        data: {
          content: options[0].value,
        },
      });
  }
};

export default withDiscordInteraction(handler);
