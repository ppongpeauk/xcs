export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roblox: {
    id: string;
    verified: boolean;
  }
  verified: {
    email: boolean;
    roblox: boolean;
  };
  profile: {
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }
}

export interface Organization {
  id: string,
  isPersonal: boolean,
  name: string,
  description: string,
  members: {}
  invitations: [],
  logs: {}
}