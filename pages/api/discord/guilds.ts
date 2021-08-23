import { decryptToken } from 'lib/backend-utils';
import discordAPI from 'lib/discordAPI';
import rateLimit from 'lib/rateLimiting';
import withSession from 'lib/session';
import credentialsData from 'models/credentials';
import GuildModule from 'models/guilds';
import tokenModule from 'models/token';
import { NextApiResponse } from 'next';
import { RawUserGivenGuild, withSessionRequest } from 'typings/typings';

// 4 request per minute
export default rateLimit(
  { max: 4, windowMs: 60 * 1000 },
  withSession(async (req: withSessionRequest, res: NextApiResponse) => {
    const session = req.session.get('user');

    if (!session) return res.status(401).json({ data: null, success: false });
    if (!req.headers.authorization) return res.status(401).json({ data: null, success: false });

    const token = await tokenModule.findOne({ for: session.id, type: 'user' });
    if (!token || (token && token.for !== session.id))
      return res.status(401).json({ data: null, success: false });

    const results = await credentialsData.findOne({ _id: session.id });
    const decryptAccessToken = decryptToken(results.AccessToken, true);

    let userGuilds = (
      await discordAPI({ auth: true, tokenType: 'Bearer', authToken: decryptAccessToken })
        .users('@me')
        .guilds.get<RawUserGivenGuild[]>()
    ).body;

    if (!userGuilds.filter) return res.status(401).json({ data: null, success: false });

    if (userGuilds && Array.isArray(userGuilds))
      // @ts-expect-error
      userGuilds = userGuilds.filter(g => (g.permissions & 0x20) === 0x20);

    const included = [];
    const excluded = [];

    const search = userGuilds.map(({ id }) => {
      return { _id: id };
    });

    const data = await GuildModule.find({ $or: search });
    const guildIds = userGuilds.map(({ id }) => id);

    for (const this_ of data)
      if (guildIds.includes(this_._id))
        included.push({ ...this_.toObject(), ...userGuilds.find(g => g.id === this_._id) });

    for (const id of guildIds)
      if (!included.map(({ _id }) => _id).includes(id)) excluded.push(userGuilds.find(g => g.id === id));

    res.json({ data: { included, excluded }, success: true });
  })
);
