import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { searchTerm } = req.query;
  const response = await fetch(
    `https://groups.roblox.com/v1/groups/search?keyword=${new URLSearchParams(
      searchTerm as string
    ).toString()}&prioritizeExactMatch=true&limit=10`
  ).then((res) => res.json());
  if (response.errors)
    return res
      .status(404)
      .json({ success: false, message: "Groups not found." });
  res.status(200).json(response.data);
}
