import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });
  if (req.method !== 'PATCH') return res.status(400).json({ message: 'Method not supported' });
  /**
   * NOTE API PROTECTION: Implement route protection // getting worked on....
   */

  const [userId, updateToken, UperToken] = req.headers.authorization.split('=+');
  if (!userId || !updateToken) return res.json({ message: 'Unauthorized' });

  const availableUserMutations = ['active', 'banner', 'username', 'discriminator', 'avatar', 'description', 'pronouns'];
  const adminMutation = [...availableUserMutations, 'site_flags', 'ratings'];
  console.log(userId, updateToken);
  // console.log(req.body);

  res.send('e');
};
