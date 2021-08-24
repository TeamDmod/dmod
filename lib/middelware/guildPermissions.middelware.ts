import { resolveGuildMemberPerms } from 'lib/backend-utils';
import { user_flags } from 'lib/constants';
import { discordAuthApi } from 'lib/discordAPI';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import GuildModule, { GuildData } from 'models/guilds';
import tokenModule from 'models/token';
import userModule, { userData } from 'models/users';
import mongoose from 'mongoose';
import { NextApiResponse } from 'next';
import { Handler } from 'next-iron-session';
import { RawGuild, RawGuildMember, withSessionRequest } from 'typings/typings';

import runMiddleware, { API } from './middelware.run';

export async function MiddelWareCheck(req: withSessionRequest, res: NextApiResponse, next: Function) {
  // Quick check session
  const session = req.session.get('user');
  if (!session) {
    res.status(401).json({ message: 'unauthorized', code: 401 });
    return;
  }

  // Check header and token see if they're valid, if the token is valid pass.
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'unauthorized', code: 401 });
    return;
  }
  await connectToDatabase();

  const token = await tokenModule.findOne({ for: session.id, type: 'user' });
  if (!token || (token && token.for !== session.id)) {
    res.status(401).json({ message: 'unauthorized', code: 401 });
    return;
  }

  // Check user in database
  const dbUser = await userModule.findOne({ _id: token.for });
  if (!dbUser || (dbUser && dbUser._id !== session.id))
    return res.status(401).json({ message: 'unauthorized', code: 401 });

  // check if this server exist and if this member has permissions.
  const { guildID } = req.query;
  const api = discordAuthApi;

  const guild = (await api.guilds(guildID as string).get<RawGuild>()).body;
  // @ts-expect-error
  if (guild.code || guild.message) return res.status(401).json({ message: 'Guild not found', code: 401 });

  const member = (
    await api
      .guilds(guildID as string)
      .members(session.id)
      .get<RawGuildMember>()
  ).body;
  // @ts-expect-error
  if (member.code || member.message) return res.status(401).json({ message: 'unauthorized', code: 401 });

  // check member permissions with site permissions
  const memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;
  const isManager =
    (memberPerms & 0x20) === 0x20 ||
    (dbUser.site_flags & user_flags.ADMIN) === user_flags.ADMIN ||
    (dbUser.site_flags & user_flags.DEVELOPER) === user_flags.DEVELOPER;

  if (!isManager) return res.status(401).json({ message: 'unauthorized', code: 401 });

  const application = await GuildModule.findOne({ _id: guild.id });
  // @ts-expect-error
  req.user = dbUser;
  // @ts-expect-error
  req.guild = guild;
  // @ts-expect-error
  req.member = member;
  // @ts-expect-error
  req.application = application;
  next();
}

// with the "withSession" "req.session" is now available too
type APIRequest = withSessionRequest & {
  user: userData & mongoose.Document<any, any>;
  application: GuildData & mongoose.Document<any, any>;
  guild: RawGuild;
  member: RawGuildMember;
};
type IHandler = (req: APIRequest, res: NextApiResponse) => Promise<any> | any;

/**
 * Authentication Middelware
 * ==========================
 */
export default function guildPermissionsCheck(handler: IHandler): API {
  return async (req, res) => {
    // Session is used in the middel ware so wrap it in the "withSession"
    await runMiddleware(req, res, withSession(MiddelWareCheck as Handler));
    // @ts-expect-error // ignore
    return handler(req, res);
  };
}
