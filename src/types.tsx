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

export interface Location {
  id: string,
  name: string,
  description?: string,
  tags: [],
  organizationId: string,
  avatar?: string,
  roblox: {
    placeId?: string,
  },
  enabled: true,
  createdAt: string,
  updatedAt: string,
}