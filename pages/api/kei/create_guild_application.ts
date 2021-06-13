import crypto from 'crypto-js';
import { isSnowflake } from 'lib/backend-utils';
import GuildModule from 'models/guilds';
import PreviewGuildModule from 'models/preview_guilds';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(400).json({ message: 'Invalid method' });
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unathenticated' });

  const decryptedAuthData = crypto.AES.decrypt(req.headers.authorization, process.env.GUILD_ENCRIPT_KEY).toString(crypto.enc.Utf8);
  const [guildId, permissions] = decryptedAuthData.split('~');
  if (!guildId || !permissions) return res.status(401).json({ message: 'Unathenticated' });
  if (!isSnowflake(guildId)) return res.status(400).json({ message: 'guild id not a snowflake' });

  // @ts-expect-error
  if (!((permissions & 0x20) === 0x20)) return res.status(400).json({ message: 'Missing permissions' });

  try {
    const short_description = 'Not much is known about this server.';
    const guild = await GuildModule.create({
      _id: guildId,
      description: '~!~ Server description has not been edited, So not much is yet known about this server. ~!~',
      short_description,
      _access_key: nanoid(156),
    });

    const previewGuild = await PreviewGuildModule.create({
      _id: guildId,
      short_description,
    });

    res.json({ guild: Object.fromEntries(Object.entries(guild.toObject()).filter(i => i[0] !== '_access_key')), previewGuild });
  } catch (_) {
    if (_.message.includes('E11000 duplicate key error collection:')) return res.status(500).json({ message: 'Duplicate key.' });

    console.log(_);
  }
};
