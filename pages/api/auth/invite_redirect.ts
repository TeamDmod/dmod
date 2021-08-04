import btoa from 'btoa';
import { sendToWebhook } from 'lib/backend-utils';
import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import GuildModule from 'models/guilds';
import PreviewGuildModule from 'models/preview_guilds';
import { NextApiRequest, NextApiResponse } from 'next';
import { RawGuild } from 'typings/typings';

const json = (res: Response) => res.json();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.error) return res.redirect('/servers');
  if (!req.query.state) return res.redirect('/servers');
  if (!req.query.code) return res.redirect(req.query.guild_id ? `/api/auth/invite?id=${req.query.guild_id}` : '/servers');
  if (typeof req.query.state !== 'string' || typeof req.query.code !== 'string') return res.redirect('/');
  await connectToDatabase();

  const stateToken = await redis.get(`STATE:TOKENS:${req.query.state}:INV`);
  if (!stateToken || stateToken !== req.query.state) return res.redirect('/servers');
  await redis.del(`STATE:TOKENS:${req.query.state}:INV`);

  const params = new URLSearchParams();
  params.set('grant_type', 'authorization_code');
  params.set('code', req.query.code as string);
  params.set('redirect_uri', process.env.INVITE_REDIRECT_URL);
  const btoaString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;

  const token = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params.toString(),
    headers: {
      Authorization: `Basic ${btoa(btoaString)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(json);

  const tokenGivenGuild: RawGuild = token.guild;

  const short_description = 'Not much is known about this server.';
  const description_default = '~!~ Server description has not been edited, So not much is yet known about this server. ~!~';

  try {
    await GuildModule.create({
      _id: tokenGivenGuild.id,
      description: tokenGivenGuild.description ?? description_default,
      short_description,
      owner_id: tokenGivenGuild.owner_id,
    });

    const preview = await PreviewGuildModule.create({
      _id: tokenGivenGuild.id,
      short_description,
      owner_id: tokenGivenGuild.owner_id,
      name: tokenGivenGuild.name,
    });

    await sendToWebhook({
      title: 'Guild created (preview displayed)',
      description: `\`\`\`json\n${JSON.stringify(preview.toObject(), null, 4)}\n\`\`\``,
      fields: [
        {
          name: 'Owner Id',
          value: tokenGivenGuild.owner_id,
        },
        {
          name: 'Region',
          value: tokenGivenGuild.region,
        },
      ],
    });

    res.redirect(`/servers/${req.query.guild_id}/settings`);
  } catch (_) {
    await sendToWebhook({
      title: 'Error on invite.',
      description: `Message: ${_?.message ?? ''}\nFull: ${_}`,
    });

    console.log(_);
    return res.redirect(`/servers/?e=gen`);
  }
};
