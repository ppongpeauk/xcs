import { NextApiRequest, NextApiResponse } from "next";
const requestIP = require("request-ip");

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const geoInfo = await fetch(`http://ip-api.com/json/${requestIP.getClientIp(req)}`);
  const geoInfoJson = await geoInfo.json();

  if (geoInfoJson.status === "fail") {
    return res.status(500).json({
      success: false,
      remoteIp: req.connection.remoteAddress,
      message: "Failed to get IP address",
    });
  }

  return res.status(200).json({
    success: true,
    ip: requestIP.getClientIp(req),
    remoteIp: req.connection.remoteAddress,
    isp: geoInfoJson.isp,
    info: geoInfoJson,
  });
};

export default handler;