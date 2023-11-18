// types
import { type User, type AccessPoint, Organization, Location } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json([]);
}
