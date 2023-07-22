import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  let robloxResponse = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/usernames/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        usernames,
        excludeBannedUsers: false
    }),
  }).then((res) => res.json()).then((res) => res.data);
};

const getRobloxUsers = async (userIds: string[]) => {
  let robloxResponse = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/users/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        userIds,
        excludeBannedUsers: false
    }),
  }).then((res) => res.json()).then((res) => res.data);

  let robloxUserAvatar = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/roblox/thumbnails/v1/users/avatar-headshot?userIds=${userIds.join(",")}&size=150x150&format=Png&isCircular=false`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json()).then((res) => res.data);

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

export { getRobloxUsers, getRobloxUsersByUsernames, roleToText, textToRole };

