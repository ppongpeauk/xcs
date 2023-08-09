import { APIApplicationCommandInteraction, APIInteractionResponse } from 'discord-api-types/v8';
import { NextApiRequest, NextApiResponse } from 'next';

export interface Alert {
  id: string;
  title: string;
  description?: string;
  type: 'info' | 'warning' | 'error';
  createdAt: string;
}
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
  platform: {
    staff: number | boolean;
    membership: number
  }
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
  updatedById?: string;
  updatedBy?: User;

  avatar?: string;
  accessGroups?: {};

  // not stored in mongoDB, but added to organization data on some endpoints
  statistics?: {
    numLocations?: number,
    numMembers?: number
  }
}

export interface OrganizationMember {
  type: "xcs" | "roblox-user" | "roblox-group";
  id: string;
  role: number;
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

export interface Dialog {
  title?: string,
  description?: string,
  confirmButtonText?: string,
  cancelButtonText?: string,
  callback?: () => void
}