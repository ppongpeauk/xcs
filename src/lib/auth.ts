import { tokenToID } from '@/pages/api/firebase';
import { NextApiRequest } from 'next';

async function authToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  // extract and verify token
  const token = authHeader?.split(' ')[1];
  return await tokenToID(token as string);
}

export { authToken };
