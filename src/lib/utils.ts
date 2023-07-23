import { clsx, type ClassValue } from "clsx";
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

const getRandomAccessPointName = () => {
  let accessPointNames = [
    "Front Entrance",
    "Main Elevators",
    "Closet B1-001",
    "Conference Room 1255",
    "Front Desk",
    "Server Room",
    "Break Room",
    "Stairwell A",
    "Lobby Area",
    "Marketing Department",
    "Reception Area",
    "Copy Room",
    "IT Department",
    "Storage Room",
    "Boardroom",
    "Conference Room A",
    "HR Department",
    "Pantry",
    "Design Studio",
    "Training Room",
    "Printer Area",
    "Mailroom",
    "Executive Offices",
    "Stairwell B",
    "Central Hub",
    "Outdoor Patio",
    "Supply Room",
    "Accounting Department",
    "Cafeteria",
    "Meeting Room A",
    "Conference Room B",
    "Back Entrance",
    "IT Helpdesk",
    "Rooftop Garden",
    "Quiet Room",
    "Collaboration Area",
    "Sales Department",
    "Interview Room",
    "Finance Department",
    "Storage Closet",
    "Conference Room C",
    "Game Room",
    "Engineering Department",
    "Stairwell C",
    "Innovation Lab",
    "Conference Room D",
    "Conference Room E",
  ];

  return accessPointNames[Math.floor(Math.random() * accessPointNames.length)];
};

const agNames = (organization: any, names: string[]) => {
  if (!organization?.accessGroups) return [];
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
      value: organization.accessGroups[key].name
    });
  }
  return res;
};



export {
  agIds, agKV, agNames, getRandomAccessPointName,
  getRobloxUsers,
  getRobloxUsersByUsernames,
  roleToText,
  textToRole
};

