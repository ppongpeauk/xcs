import { APIApplicationCommandInteraction, APIInteractionResponse } from 'discord-api-types/v8';
import { NextApiRequest, NextApiResponse } from 'next';

export interface User {
  id: string;
  name?: {
    first: string
    last?: string
    privacyLevel: number
  }; // deprecated
  displayName?: string;
  username: string;
  bio?: string;
  avatar: string | null;
  email: {
    address: string;
    privacyLevel: number;
  };
  roblox: {
    id: string | null;
    displayName?: string;
    username?: string
    verified: boolean;
  };
}

export interface Organization {
  id: string;

  name: string;
  ownerId: string;
  owner?: User;
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

  // not stored in mongoDB, but added to organization data on some endpoints
  statistics?: {
    numLocations?: number,
    numMembers?: number
  }
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
