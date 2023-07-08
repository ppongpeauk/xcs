import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ error: "Missing data" });
  }

  let apiKey = data[0];
  let locationId = data[1];

  return res.status(200).json({
    query: {
      apiKey,
      locationId,
    },
    data: {
      // access point id
      "Lau38N0F": { 
        "DoorSettings": {
          "DoorName": "Door 1",
          "Active": "1",
          "Locked": "1",
          "Timer": 8,
        },
        "AuthorizedUsers": {
          32757211: "restrafes"
        }
      }
    },
  });
}
