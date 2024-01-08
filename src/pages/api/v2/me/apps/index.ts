// types
import { type User, type AccessPoint, Organization, DeveloperApplication } from '@/types';
import { type NextApiRequest, type NextApiResponse } from 'next';
// auth & database
import { authToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { uuid as uuidv4 } from 'uuidv4';
import { generate as generateString } from 'randomstring';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'POST', 'DELETE'].includes(req.method as string))
    return res.status(405).json({ message: 'Method not allowed.' });

  // check if the user is authenticated
  const uid = await authToken(req);
  if (!uid) return res.status(401).json({ message: 'Unauthorized.' });

  const mongoClient = await clientPromise;
  const db = mongoClient.db(process.env.MONGODB_DB);
  const user = (await db.collection('users').findOne({ id: uid })) as User | null;

  // check if user exists
  if (!user) return res.status(401).json({ message: 'Unauthorized.' });

  if (req.method === 'GET') {
    let apps = await db
      .collection('developerApplications')
      .find(
        { createdBy: uid },
        {
          projection: {
            apiKey: 0
          }
        }
      )
      .toArray();
    return res.status(200).json(apps);
  } else if (req.method === 'POST') {
    let apps = await db.collection('developerApplications').find({ createdBy: uid }).toArray();
    const { name, description } = req.body;
    const uuid = uuidv4();
    const apiKey =
      'api_' +
      generateString({
        length: 32,
        charset: 'alphanumeric'
      });

    if (!name) return res.status(400).json({ message: 'Missing parameters.' });
    if (apps.find((app) => app.name === name))
      return res.status(400).json({ message: 'Application with that name already exists.' });
    if (description && description.length > 500) return res.status(400).json({ message: 'Description too long.' });

    const app = {
      id: uuid,
      apiKey,
      name,
      description,
      createdBy: uid,
      createdAt: new Date(),
      updatedAt: new Date()
    } as DeveloperApplication;

    await db.collection('developerApplications').insertOne(app);

    return res.status(200).json({ success: true, message: 'Application created.', apiKey });
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: 'Missing parameters.' });

    const app = await db.collection('developerApplications').findOne({ id });

    if (!app) return res.status(400).json({ message: 'Application not found.' });
    if (app.createdBy !== uid) return res.status(401).json({ message: 'Unauthorized.' });

    await db.collection('developerApplications').deleteOne({ id });

    return res.status(200).json({ success: true, message: 'Application deleted.' });
  }
}
