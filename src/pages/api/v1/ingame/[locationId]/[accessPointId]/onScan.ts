import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
// @ts-ignore
import mergician from "mergician";
import { NextApiRequest, NextApiResponse } from "next";

const mergicianOptions = { appendArrays: true };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const {
    locationId,
    accessPointId,
    apiKey,
    userId,
  } = req.query;

  const mongoClient = await clientPromise;

  const db = mongoClient.db(process.env.MONGODB_DB as string);
  const dbAccessPoints = db.collection("accessPoints");
  const dbLocations = db.collection("locations");
  const dbOrganizations = db.collection("organizations");
  const dbUsers = db.collection("users");

  // check if API key is empty
  if (!apiKey) {
    return res
      .status(401)
      .json({ success: false, message: "No API key provided" });
  }

  // get location
  const location = await dbLocations.findOne({ id: locationId });
  if (!location) {
    return res
      .status(404)
      .json({ success: false, message: "Location not found" });
  }

  // get organization
  const organization = await dbOrganizations.findOne({
    id: location.organizationId,
  });
  if (!organization) {
    return res
      .status(404)
      .json({ success: false, message: "Organization not found" });
  }

  // check API key
  if (!((apiKey as string) in organization.apiKeys)) {
    return res.status(401).json({ success: false, message: "Invalid API key" });
  }

  // get access point
  const accessPoint = await dbAccessPoints.findOne(
    { id: accessPointId },
    { projection: { _id: 0 } }
  );
  if (!accessPoint) {
    return res
      .status(404)
      .json({ success: false, message: "Access point not found" });
  }

  // TODO: finish this

  // check if access point is active, if not, deny access
  if (!accessPoint.config.active) {
    return res.status(200).json({
      success: true,
      grant_type: "access_point_inactive",
      response_code: "access_denied",
      scan_data: accessPoint.config?.scanData?.denied || {},
    });
  }

  // check if access point is armed, if not, grant access
  if (!accessPoint.config.armed) {
    return res.status(200).json({
      success: true,
      grant_type: "access_point_unarmed",
      response_code: "access_granted",
      scan_data: accessPoint.config?.scanData?.granted || {},
    });
  }

  const allowedGroups = accessPoint.config.alwaysAllowed.groups;
  const allowedUsers = accessPoint.config.alwaysAllowed.users;

  // get all access groups that are open to everyone
  const openAccessGroups = Object.keys(organization.accessGroups).filter(
    (groupId) => organization.accessGroups[groupId].config.openToEveryone
  );

  // get all organization members that belong to allowed groups
  var allowedOrganizationMembers = {} as any;
  for (const group of allowedGroups) {
    for (const [memberId, member] of Object.entries(
      organization.members
    ) as any) {
      if (
        !((memberId as string) in allowedOrganizationMembers) &&
        member.accessGroups.includes(group)
      ) {
        allowedOrganizationMembers[memberId] = member.accessGroups;

        // add open access groups to the user's allowed groups
        allowedOrganizationMembers[memberId] = mergician(mergicianOptions)(
          allowedOrganizationMembers[memberId],
          openAccessGroups
        );
      }
    }
  }

  // fetch all roblox ids from allowed users
  let allowedRobloxIds = {} as any;
  for (const memberId of Object.keys(allowedOrganizationMembers)) {
    const member = organization.members[memberId];
    if (member.type === "roblox") {
      allowedRobloxIds[member.id] = memberId;
    } else {
      const user = await dbUsers.findOne({ id: memberId }).then((user) => user);
      if (user && user.roblox?.verified) {
        allowedRobloxIds[user.roblox.id] = memberId;
      }
    }
  }

  const isAllowed = Object.keys(allowedRobloxIds).includes(userId as string);

  if (isAllowed) {
    let scanData = {} as any;
    const memberId = allowedRobloxIds[userId as string];
    const memberGroups = allowedOrganizationMembers[memberId as string];

    // group scan data
    if (memberGroups) {
      for (const group of Object.values(memberGroups) as any) {
        if (organization.accessGroups[group].config.active) {
          scanData = mergician(mergicianOptions)(
            scanData,
            organization.accessGroups[group].scanData || {}
          );
        }
      }
    }

    // user scan data, user scan data overrides group scan data
    scanData = mergician(mergicianOptions)(
      scanData,
      organization.members[memberId].scanData || {}
    );

    return res.status(200).json({
      success: true,
      grant_type: "user_scan",
      response_code: "access_granted",
      scan_data: scanData || {},
    });
  } else {
    return res.status(200).json({
      success: true,
      grant_type: "user_scan",
      response_code: "access_denied",
      scan_data: accessPoint.config?.scanData?.denied || {},
    });
  }
}
