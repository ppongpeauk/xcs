import { useAuthContext } from "@/contexts/AuthContext";
import { AccessGroup, Organization } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const roleToText = (role: number) => {
  role = Number(role);
  switch (role) {
    case 0:
      return "Guest";
    case 1:
      return "Member";
    case 2:
      return "Manager";
    case 3:
      return "Owner";
    default:
      return "Member";
  }
};

const textToRole = (role: string) => {
  role = role.toString().toLowerCase();
  switch (role) {
    case "guest":
      return 0;
    case "member":
      return 1;
    case "manager":
      return 2;
    case "owner":
      return 3;
    default:
      return 1;
  }
};

const getRobloxUsersByUsernames = async (usernames: string[]) => {
  let robloxResponse = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/usernames/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames,
        excludeBannedUsers: false,
      }),
    }
  )
    .then((res) => res.json())
    .then((res) => res.data);

  return robloxResponse;
};

const getRobloxUsers = async (userIds: string[]) => {
  let robloxResponse = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds,
        excludeBannedUsers: false,
      }),
    }
  )
    .then((res) => res.json())
    .then((res) => res.data);

  let robloxUserAvatar = await fetch(
    `${
      process.env.NEXT_PUBLIC_ROOT_URL
    }/api/v1/roblox/thumbnails/v1/users/avatar-headshot?userIds=${userIds.join(
      ","
    )}&size=150x150&format=Png&isCircular=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.data);

  for (let i = 0; i < robloxResponse.length; i++) {
    robloxResponse[i].avatar = robloxUserAvatar[i].imageUrl;
  }

  let response = Object();

  // convert array to object, with userId as key
  for (let i = 0; i < robloxResponse.length; i++) {
    response[robloxResponse[i].id as string] = robloxResponse[i];
  }

  return response;
};

const getRobloxGroups = async (groupIds: string[]) => {
  let robloxResponse = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/groups/v2/groups?groupIds=${groupIds?.join(",") || 0}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.data);

  let robloxGroupThumbnail = await fetch(
    `${
      process.env.NEXT_PUBLIC_ROOT_URL
    }/api/v1/roblox/thumbnails/v1/groups/icons?groupIds=${groupIds.join(
      ","
    )}&size=150x150&format=Png&isCircular=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.data);

  for (let i = 0; i < robloxResponse.length; i++) {
    robloxResponse[i].avatar = robloxGroupThumbnail[i].imageUrl;
  }
  
  // get roles for each group
  for (let i = 0; i < robloxResponse.length; i++) {
    let robloxGroupRoles = await fetch(
      `${
        process.env.NEXT_PUBLIC_ROOT_URL
      }/api/v1/roblox/groups/v1/groups/${robloxResponse[i].id}/roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    
      .then((res) => res.json())
      .then((res) => res.roles);
    robloxResponse[i].roles = robloxGroupRoles;
  }

  let response = Object();

  // convert array to object, with groupId as key
  for (let i = 0; i < robloxResponse.length; i++) {
    response[robloxResponse[i].id as string] = robloxResponse[i];
  }

  return response;
};

const getRandomAccessPointName = () => {
  let accessPointNames = [
    "Front Entrance",
    "Back Entrance",
    "Main Lobby",
    "Reception Area",
    "Mail Room",
    "Copy Room",
    "Supply Closet",
    "IT Department",
    "HR Department",
    "Accounting Department",
    "Sales Department",
    "Marketing Department",
    "Executive Offices",
    "Conference Room A",
    "Conference Room B",
    "Conference Room C",
    "Conference Room D",
    "Break Room",
    "Cafeteria",
    "Kitchen",
    "Bathrooms",
    "Elevator Bank",
    "East Stairwell",
    "West Stairwell",
    "Electrical Room",
    "Janitor Closet",
    "Boiler Room",
    "Loading Dock",
    "Front Desk",
    "Lobby Desk",
    "Security Office",
    "East Wing",
    "West Wing",
    "North Wing",
    "South Wing",
    "Patio",
    "Garden",
    "Fountain",
    "Sitting Area",
    "Parking Garage",
    "Visitor Lot",
    "Employee Lot",
    "Server Room",
    "Printing Room",
    "Storage Room",
    "Mechanical Room",
    "Telecom Room",
    "Electrical Closet",
    "Janitor Office",
    "Maintenance Shop",
  ];

  return accessPointNames[Math.floor(Math.random() * accessPointNames.length)];
};

const agNames = (organization: any, names: string[]) => {
  if (!organization?.accessGroups) {
    console.warn("No access groups found", organization, names);
    return [];
  }
  let res = [];
  for (let name of names) {
    let find = Object.keys(organization.accessGroups).find(
      (element: any) => organization.accessGroups[element].name === name
    );
    if (find) {
      res.push(find);
    }
  }
  return res;
};

const agIds = (organization: any, ids: string[]) => {
  if (!organization?.accessGroups) return [];
  let res = [];
  for (let id of ids) {
    let find = Object.keys(organization.accessGroups).find(
      (element: any) => organization.accessGroups[element].id === id
    );
    if (find) {
      res.push(organization.accessGroups[find].name);
    }
  }
  return res;
};

const agKV = (organization: any) => {
  if (!organization?.accessGroups) return [];
  let res = [];
  for (let key of Object.keys(organization.accessGroups)) {
    res.push({
      label: organization.accessGroups[key].name,
      value: organization.accessGroups[key].name,
    });
  }
  return res;
};

const getLocation = async (locationId: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useAuthContext();

  let location;
  await user.getIdToken().then(async (token: string) => {
    const ret = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/locations/${locationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => res.data);
    location = ret;
  });

  return location;
};

const getAccessGroupType = (organization: Organization, ag: AccessGroup) => {
  if (ag.type === "organization") {
    return "Organization";
  } else if (ag.type === "location") {
    // get location name
    // const location = Object.values(
    //   organization?.locations as AccessGroup[]
    // ).find((l: any) => l.id === ag.id);
    return "Unknown";
  } else {
    return ag.type;
  }
};

const getAccessGroupOptions = (organization: Organization) => {
  if (!organization) return [];
  const ags = Object.values(organization?.accessGroups as AccessGroup[]) || [];
  interface Group {
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }
  let groups = [] as any;

  ags.forEach((ag: AccessGroup) => {
    // check if the group is already in the groups object
    if (
      groups.find(
        (g: Group) => g.label === getAccessGroupType(organization, ag)
      )
    ) {
      // if it is, add the option to the options array
      groups
        .find((g: Group) => g.label === getAccessGroupType(organization, ag))
        .options.push({
          label: ag.name,
          value: ag.id,
        });
    } else {
      // if it's not, add the group to the groups array
      groups.push({
        label: getAccessGroupType(organization, ag),
        options: [
          {
            label: ag.name,
            value: ag.id,
          },
        ],
      });
    }
  });

  // sort the groups so organizations are at the bottom
  groups.sort((a: Group, b: Group) => {
    if (a.label === "Organization") return 1;
    if (b.label === "Organization") return -1;
    return 0;
  });

  return groups;
};

export {
  agIds,
  agKV,
  agNames,
  getAccessGroupOptions,
  getAccessGroupType,
  getRandomAccessPointName, getRobloxGroups, getRobloxUsers, getRobloxUsersByUsernames,
  roleToText,
  textToRole
};

