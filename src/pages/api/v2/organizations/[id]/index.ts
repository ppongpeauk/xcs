import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { deleteOrganizationProfilePicture } from '@/pages/api/firebase';
import { Organization, User } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';

const projection = { apiKeys: 0 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get API key from request header
  // const apiKey = req.headers['Authorization'];
  // if (!apiKey) return res.status(401).json({ message: 'Unauthorized.' });

  // get organization ID from request query
  const { id } = req.query;

  const client = await clientPromise;
  const db = await client.db(process.env.MONGODB_DB as string);

  // check if the user is authenticated
  const uid = await authToken(req);

  // check if user is a member of the organization
  const organization = (await db.collection('organizations').findOne(
    { id },
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
        updatedBy: 1,
        ownerId: 1
      }
    }
  )) as Organization | null;
  if (!organization) return res.status(404).json({ message: 'Organization not found.' });

  if (req.method === 'GET') {
    let organizationCreator = undefined;
    organizationCreator = (await db
      .collection('users')
      .findOne(
        { id: organization.ownerId },
        { projection: { id: 1, displayName: 1, username: 1, avatar: 1 } }
      )) as User | null;

    // if (!uid) return res.status(401).json({ message: 'Unauthorized.', error: 0 });
    // const user = (await db.collection('users').findOne({ id: uid })) as User | null;
    // if (!organization.members[uid]) return res.status(401).json({ message: 'Unauthorized.' });
    // get organization
    // const organization = (await db.collection('organizations').findOne({ id }, { projection })) as Organization | null;

    if (!organization) return res.status(404).json({ success: false, message: 'Not found.' });

    return res.status(200).json({
      ...organization,
      owner: organizationCreator
    });
  } else if (req.method === 'PUT') {
    // check if user is the owner of the organization
    if (uid !== organization.ownerId) return res.status(401).json({ message: 'Unauthorized.', error: 0 });

    // update organization
    const { name, description } = req.body;

    // checks
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    if (name.length > 512) return res.status(400).json({ message: 'Name must be less than 512 characters.' });

    const updatedAt = new Date().toISOString();

    const { value } = await db.collection('organizations').findOneAndUpdate(
      { id },
      {
        $set: {
          name,
          description,
          updatedAt,
          updatedById: uid
        }
      }
    );

    return res.status(200).json(value);
  } else if (req.method === 'DELETE') {
    const timestamp = new Date();
    const organizations = db.collection('organizations');
    const locations = db.collection('locations');
    const invitations = db.collection('invitations');
    const accessPoints = db.collection('accessPoints');
    const notifications = db.collection('notifications');

    await organizations.deleteOne({ id: organization.id });
    await locations.deleteMany({ organizationId: organization.id });
    await invitations.deleteMany({ organizationId: organization.id });
    await accessPoints.deleteMany({ organizationId: organization.id });
    await notifications.deleteMany({ organizationId: organization.id });

    try {
      await deleteOrganizationProfilePicture(organization.id);
    } catch (error) {}

    return res.status(200).json({ message: 'Successfully deleted organization!', success: true });
  }
}
