import { APIApplicationCommandInteraction, APIInteractionResponse } from 'discord-api-types/v8';
import { NextApiRequest, NextApiResponse } from 'next';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roblox: {
    id: string;
    verified: boolean;
  };
  verified: {
    email: boolean;
    roblox: boolean;
  };
  profile: {
    bio: string;
    location: string;
    website: string;
    avatar: string;
  };
}

export interface Organization {
  id: string;

  name: string;
  description: string;
  isPersonal: boolean;

  members: {};
  invitations: [];
  logs: {};
  apiKeys: {};

  createdAt: string;
  updatedAt: string;

  avatar?: string;
  accessGroups?: {};
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  tags: [];
  organizationId: string;
  avatar?: string;
  roblox: {
    placeId?: string;
  };
  enabled: true;
  createdAt: string;
  updatedAt: string;
}

export interface AccessGroup {
  id: string;
  name: string;
  locationName?: string;
  locationId?: string;
  type: 'organization' | 'location';
}

export type DiscordInteractionApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<APIInteractionResponse>,
  interaction: APIApplicationCommandInteraction
) => void | Promise<void>;
