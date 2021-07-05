import { resolveGuildMemberPerms } from 'lib/backend-utils';
import { user_flags } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import { typeValidators, validators } from 'lib/serverUpdateValidators';
import GuildModule from 'models/guilds';
import PreviewGuildModule from 'models/preview_guilds';
import userModule from 'models/users';
import { NextApiRequest, NextApiResponse } from 'next';
import { RawGuild, RawGuildMember } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

const validMethods = ['PATCH'];
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validMethods.includes(req.method)) {
    res.setHeader('Allow', validMethods);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  if (!req.headers.authorization || !req.body) return res.status(401).json({ message: 'unauthorized 1', code: 401 });

  const canUpdate = ['completed', 'description', 'short_description', 'recruiting', 'look_types', 'view', 'tags', 'invite', 'applyed'];
  const [user_id, user_updateAccess, guild_updateAccess] = req.headers.authorization.split('=+');
  if (!user_id || !user_updateAccess || !guild_updateAccess) return res.status(401).json({ message: 'unauthorized 2', code: 401 });
  await connectToDatabase();

  const dbUser = await userModule.findOne({ updates_access: user_updateAccess });
  if (!dbUser || (dbUser && dbUser._id !== user_id)) return res.status(401).json({ message: 'unauthorized 3', code: 401 });
  const dbGuild = await GuildModule.findOne({ _access_key: guild_updateAccess });
  if (!dbGuild || (dbGuild && dbGuild._id !== req.query.guildID)) return res.status(404).json({ message: 'Guild not found', code: 404 });

  const authHead = { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } };

  const guild: RawGuild = await fetch(`${API_ENDPOINT}/guilds/${req.query.guildID}`, authHead).then(json);
  // @ts-expect-error
  if (guild.code || guild.message) return res.status(401).json({ message: 'Guild not found', code: 401 });

  const member: RawGuildMember = await fetch(`${API_ENDPOINT}/guilds/${req.query.guildID}/members/${user_id}`, authHead).then(json);
  // @ts-expect-error
  if (member.code || member.message) return res.status(401).json({ message: 'unauthorized 4', code: 401 });

  const memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;
  const isManager =
    (memberPerms & 0x20) === 0x20 || (dbUser.site_flags & user_flags.ADMIN) === user_flags.ADMIN || (dbUser.site_flags & user_flags.DEVELOPER) === user_flags.DEVELOPER;

  if (!isManager) return res.status(401).json({ message: 'unauthorized 5', code: 401 });
  if (dbGuild.completed) canUpdate.shift();

  const resolvedBody = JSON.parse(req.body);
  let typeError = false;
  const body = Object.fromEntries(
    Object.entries(resolvedBody).filter(([key, value]) => {
      if (!canUpdate.includes(key)) return false;

      if (!(typeValidators[key] ?? (() => false))(value)) {
        typeError = true;
        return false;
      }

      return true;
    })
  );

  if (typeError) return res.status(400).json({ message: 'Error invalid property type in body', code: 400 });
  if (Object.keys(body).length <= 0) return res.status(400).json({ message: 'Body keys was left at length of 0', code: 400 });

  const validatorData = { user_premium: dbUser.premium, guildID: dbGuild._id };
  let e = null;
  for await (const [key, value] of Object.entries(body)) {
    const validation = validators[key] ?? validators.DEFAULT;
    const validated = await validation({ value, ...validatorData });
    if (validated.error) e = validated.message;
  }

  if (e) return res.json({ message: e, success: false });

  try {
    const Inew = await GuildModule.findOneAndUpdate({ _access_key: guild_updateAccess }, body, { new: true });
    const { hasOwnProperty } = Object.prototype;

    if (hasOwnProperty.call(body, 'short_description') || hasOwnProperty.call(body, 'completed')) {
      await PreviewGuildModule.findOneAndUpdate(
        { _id: Inew._id },
        {
          ...(canUpdate.includes('completed') ? { completed: true } : {}),
          ...(Object.keys(body).includes('short_description') ? { short_description: body.short_description as string } : {}),
        }
      );
    }

    res.json(Object.fromEntries(Object.entries(Inew.toObject()).filter(i => i[0] !== '_access_key')));
  } catch (error) {
    console.log(error);
  }
  // returnWithWebhook({ message: `Unknown update error: ${_.message ?? _}`, success: false }, { description: `Error while updating ${user._id}; ${_.message ?? _}` }, 500);
};
