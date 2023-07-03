import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    console.log(req.method);
    return res.status(405).json({ message: "Method not allowed" });
  };

  // Authorization Header
  const authHeader = req.headers.authorization;

  // Bearer Token
  const token = authHeader?.split(' ')[1];

  // Verify Token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  res.status(200).json({
    organizations: [
      {
        id: "1",
        name: "Organization 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        ownedBy: "FF0gCiIJYUPfmA4CTfqXTyPcHQb2",
      },
      {
        id: "2",
        name: "Organization 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        ownedBy: "FF0gCiIJYUPfmA4CTfqXTyPcHQb2",
      },
    ],
   })
}