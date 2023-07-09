import { NextApiRequest, NextApiResponse } from "next";
const requestIP = require("request-ip");

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.status(200).json({
    success: true,
    ip: requestIP.getClientIp(req),
  });
};

export default handler;