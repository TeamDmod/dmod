import { user_flags } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import userModule from 'models/users';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized', success: false });
  if (req.method !== 'PATCH') return res.status(400).json({ message: 'Method not supported', success: false });
  await connectToDatabase();
  /**
   * NOTE API PROTECTION: Implement route protection // Shoud all work but still need to fix something small (note down)
   */

  const [userId, updateToken, UperToken] = req.headers.authorization.split('=+');
  if (!userId || !updateToken) return res.json({ message: 'Unauthorized', success: false });

  const userMutations = ['active', 'banner', 'description', 'pronouns'];
  const AllMutations = [...userMutations, 'site_flags', 'ratings', 'username', 'discriminator', 'avatar'];
  const modMutations = [...userMutations.filter(config => !['pronouns'].includes(config))];

  const user = await userModule.findOne({ updates_access: updateToken });

  let uperUser = undefined;
  if (UperToken) uperUser = await userModule.findOne({ updates_access: UperToken });

  if (uperUser === null) return res.status(404).json({ message: 'Unknow uper user', success: false });
  if (!user) return res.status(404).json({ message: 'Unknown user', success: false });

  if (user._id !== userId) return res.status(401).json({ message: 'Unauthorized request', success: false });

  // update admin check
  if (
    uperUser &&
    ((((user.site_flags & user_flags.ADMIN) === user_flags.ADMIN || (user.site_flags & user_flags.DEVELOPER) === user_flags.DEVELOPER) &&
      (uperUser.site_flags & user_flags.ADMIN) === user_flags.ADMIN) ||
      (uperUser.site_flags & user_flags.DEVELOPER) === user_flags.DEVELOPER)
  )
    return res.status(400).json({ message: 'Admins cant update admins', success: false });

  /**
   * Although `AllMutations` is declared its mainly like a list of currently supported mutations/updates
   * This is the whole key propertys of the doc filtering off some.
   */
  const fullPropers = Object.keys(user.toObject()).filter(i => !['id', 'tag', 'avatarURL'].includes(i));
  const propertyTypes: { [key: string]: string } = fullPropers.reduce((prev, curr) => {
    return { ...prev, [curr]: typeof user.toObject()[curr] };
  }, {});

  const isAdmin =
    ((!uperUser ? user.site_flags : uperUser.site_flags) & user_flags.ADMIN) === user_flags.ADMIN ||
    ((!uperUser ? user.site_flags : uperUser.site_flags) & user_flags.DEVELOPER) === user_flags.DEVELOPER;

  const isMod = ((!uperUser ? user.site_flags : uperUser.site_flags) & user_flags.SITE_MOD) === user_flags.SITE_MOD;

  console.log(isAdmin, isMod, !uperUser ? 'user' : 'uper');

  const bodyData = JSON.parse(req.body);
  let typeError = false;
  const objectedUpdateQuery = Object.fromEntries(
    Object.entries(bodyData).filter(([key, value]) => {
      if (!fullPropers.includes(key)) return false;
      /**
       * NOTE: better type checking. E.g: updating ratings and setting it to an object instead of an array
       */
      if (typeof value !== propertyTypes[key]) {
        typeError = true;
        return false;
      }

      /**
       * NOTE: will have to create a resolver for if you're updating `site_flags` (as admin) on your self it will be blocked or will check if the
       * perms are lower what you have
       */
      if (isAdmin && AllMutations.includes(key)) return true;
      if (isMod && modMutations.includes(key)) return true;

      return !uperUser ? userMutations.includes(key) : false;
    })
  );

  if (typeError) return res.json({ message: 'Error invalid property type in body', success: false });
  if (Object.keys(objectedUpdateQuery).length <= 0) return res.json({ message: 'Body keys was left at length of 0', success: false });

  try {
    const updateData = await userModule.findOneAndUpdate({ _id: user._id }, objectedUpdateQuery);
    res.json({ message: Object.fromEntries(Object.entries(updateData.toObject()).filter(i => i[0] !== 'updates_access')), success: true });
  } catch (_) {
    res.json({ message: 'Unknown update error: ' + _.message ?? _, success: false });
  }
};
