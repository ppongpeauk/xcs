// types
import { type User, type AccessPoint, Organization, Location } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';

// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id: locationId } = query;

  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB as string);

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if location exists
  const location = (await db.collection('locations').findOne({ id: locationId })) as Location | null;
  if (!location) return res.status(404).json({ message: 'Location not found.' });

  // check if user is a member of the organization
  const organization = (await db.collection('organizations').findOne(
    { id: location.organizationId },
    {
      projection: {
        id: 1,
        name: 1,
        description: 1,
        avatar: 1,
        members: 1,
        statistics: 1,
        updatedAt: 1,
        createdAt: 1,
        updatedById: 1,
        updatedBy: 1
      }
    }
  )) as Organization | null;
  if (!organization) return res.status(404).json({ message: 'Organization not found.' });
  if (!organization.members[uid]) return res.status(401).json({ message: 'Unauthorized.' });

  switch (method) {
    case 'GET':
      try {
        const accessPoints = (await db
          .collection('accessPoints')
          .find({ locationId })
          .toArray()) as unknown as AccessPoint[];
        const occupiedTags = accessPoints.reduce((acc: string[], accessPoint: AccessPoint) => {
          if (accessPoint.tags) {
            return [...acc, ...accessPoint.tags];
          }
          return acc;
        }, []);
        res.status(200).json(occupiedTags);
      } catch (error) {
        res.status(500).json({ message: error });
      }
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
