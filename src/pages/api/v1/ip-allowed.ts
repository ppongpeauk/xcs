import { NextApiRequest, NextApiResponse } from "next";
const requestIP = require("request-ip");

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const ip = req.headers["x-real-ip"] || requestIP.getClientIp(req);

  const geoInfo = await fetch(`http://ip-api.com/json/${ip}`);
  const geoInfoJson = await geoInfo.json();

  if (geoInfoJson.status === "fail") {
    return res.status(500).json({
      success: false,
      collection: [ip, req.socket.remoteAddress, requestIP.getClientIp(req), req.headers["x-real-ip"], req.headers["x-forwarded-for"]],
      message: "Failed to get IP address",
    });
  }

  return res.status(200).json({
    success: true,
    collection: [ip, req.socket.remoteAddress, requestIP.getClientIp(req), req.headers["x-real-ip"], req.headers["x-forwarded-for"]],
    isp: geoInfoJson.isp,
    info: geoInfoJson,
  });
};

export default handler;