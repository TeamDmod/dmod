import GuildView from 'components/guild/guildView';
import Layout from 'components/layout';
import crypto from 'crypto-js';
import { genToken } from 'lib/backend-utils';
import { isServer } from 'lib/isServer';
import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import withSession from 'lib/session';
import guilds, { GuildData } from 'models/guilds';
import tokenModule from 'models/token';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useEffect, useState } from 'react';
import { RawGuild, withSessionGetServerSideProps } from 'typings/typings';
import type { DmodWebSocket } from 'websocket';

interface props {
  failed: boolean;
  hash: string;
  guild: RawGuild & GuildData & { guild_description: string };
  ws: DmodWebSocket;
  hasApp: boolean;
  len: number;
}

function resolveType(str: string): string {
  if (str.startsWith('a_')) return `${str}.gif`;
  return `${str}.png`;
}

export default function guildView({ failed, guild: guild_, hash, ws, hasApp, len }: props) {
  const [guild, setGuild] = useState(guild_);
  const [isManager, setIsManager] = useState(false);

  if (failed) {
    return (
      <Layout>
        <div>Something went wrong loading data! try again in a bit.</div>
      </Layout>
    );
  }

  useEffect(() => {
    if (!ws.ready || !ws._socket) {
      console.log('socket connection not found');

      setIsManager(false);
      return;
    }
    function GuildConnectFn(data) {
      if (!data) return;
      const { guild: g, user } = data;

      setGuild({ ...guild, ...g, description: guild.description });
      setIsManager(((user ?? { permissions: 0 }).permissions & 0x20) === 0x20);
    }
    function MemberCount(data) {
      if (data.guild_id !== guild.id) return;
      setGuild({ ...guild, member_count: data.member_count });
    }
    console.log('guild connecting...');

    if (!isServer) {
      ws.requestConnect(guild.id, hash);
      ws.on('CONNECT_GUILD', GuildConnectFn);
      ws.on('GUILD_MEMBER_COUNT_CHANGE', MemberCount);
    }

    return () => {
      ws.removeListener('GUILD_MEMBER_COUNT_CHANGE', MemberCount);
      ws.removeListener('CONNECT_GUILD', GuildConnectFn);
      if (!isServer) {
        ws.requestDisconnect(guild.id);
      }
    };
  }, [ws.ready]);

  const icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${resolveType(guild.icon)}` : '/icon.png';

  return (
    <Layout
      title={`${guild.name} - dmod.gg`}
      description={`${guild.name} - Server information`}
      image={guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${resolveType(guild.banner)}` : icon}
    >
      <GuildView guild={guild} isManager={isManager} hasApp={hasApp} len={len} Inpreview={false} />
    </Layout>
  );
}

const API_ENDPOINT = 'https://discord.com/api/v8';
const TIME = 60 * 60 * 2; // 2h in seconds
const json = (res: Response) => res.json();

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');

    const guildData = await guilds.findOne({ _id: context.query.guildID as string });
    if (!guildData) return { notFound: true };

    const authHead = { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } };

    const guildCache = await redis.get(`guild:${context.query.guildID}`);
    let guild: RawGuild;
    if (!guildCache) {
      guild = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}?with_counts=true`, authHead).then(json);
      // @ts-expect-error
      if (guild.code || guild.message) return { props: { failed: true } };

      await redis.setex(`guild:${context.query.guildID}`, TIME, JSON.stringify(guild));

      if (guild.banner)
        await redis.set(
          `guild:${context.query.guildID}:banner`,
          `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}${guild.banner.startsWith('a_') ? '.gif' : '.png'}`
        );
    } else {
      guild = JSON.parse(guildCache);
    }

    let tokenData = await tokenModule.findOne({ type: 'gatewayGuild', for: guild.id });
    const genTokenModel = async () => {
      const token = genToken();
      const hash = crypto.SHA512(token).toString();

      tokenData = await tokenModule.create({ type: 'gatewayGuild', for: guild.id, tokenHash: hash, token });
    };
    if (!tokenData) await genTokenModel();
    if (tokenData.use > 6) {
      await tokenData.deleteOne();
      await genTokenModel();
    }

    return {
      props: {
        failed: false,
        hash: tokenData.tokenHash,
        hasApp: session?.id ? guildData.applyed.includes(session.id) : false,
        len: guildData.application_status_data ? guildData.applyed.length : 0,
        guild: {
          ...guild,
          guild_description: guild.description,
          ...Object.fromEntries(Object.entries(guildData.toObject()).filter(d => d[0] !== 'applyed')),
        },
      },
    };
  }
);
