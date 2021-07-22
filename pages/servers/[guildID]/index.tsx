import GuildView from 'components/guildView';
import Layout from 'components/layout';
import { resolveGuildMemberPerms } from 'lib/backend-utils';
// import crypto from 'crypto-js';
import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import withSession from 'lib/session';
// import credentials from 'models/credentials';
import guilds, { GuildData } from 'models/guilds';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React from 'react';
import { RawGuild, RawGuildMember, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  failed: boolean;
  isManager: boolean;
  guild: RawGuild & GuildData & { guild_description: string };
}

export default function guildView({ failed, guild, isManager }: props) {
  if (failed) {
    return (
      <Layout>
        <div>Something went wrong loading data! try again in a bit.</div>
      </Layout>
    );
  }

  function resolveType(str: string): string {
    if (str.startsWith('a_')) return `${str}.gif`;
    return `${str}.png`;
  }

  const icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${resolveType(guild.icon)}` : '/icon.png';

  return (
    <Layout
      title={`${guild.name} - dmod.gg`}
      description={`${guild.name} - Server information`}
      image={guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${resolveType(guild.banner)}` : icon}
    >
      <GuildView guild={guild} isManager={isManager} Inpreview={false} />
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
      // NOTE: Currently no need to save/cache the banner
      // if (guild.banner)
      //   await redis.setex(
      //     `guild:${context.query.guildID}:banner`,
      //     TIME,
      //     `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}${guild.banner.startsWith('a_') ? '.gif' : '.png'}`
      //   );
    } else {
      guild = JSON.parse(guildCache);
    }

    // TODO: Cache the member so when the "x-ratelimit-remaining" hits 1 it will use the cacheed member permissins to check if they are managers of this server.
    // On that 1 left set redis "limited" to 1(1=true|0=false) with a expreation of 3-5 seconds.
    // https://discord.com/developers/docs/topics/rate-limits#rate-limits
    // "members:ID:permissions" => number

    // Note: get and resolve member permissions
    let member: RawGuildMember = null;
    if (session?.id) {
      const Member = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}/members/${session.id}`, authHead);
      // console.log(Member.headers);
      member = await Member.json();
    }
    // @ts-expect-error
    if (member && (member.code || member.message)) return { props: { failed: true } };

    const memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;
    // NoteEnd

    const isManager = (memberPerms & 0x20) === 0x20;

    if (!isManager && (!guildData.completed || !guildData.view)) return { notFound: true };

    return {
      props: {
        isManager,
        failed: false,
        guild: {
          ...guild,
          guild_description: guild.description,
          ...Object.fromEntries(Object.entries(guildData.toObject()).filter(d => !['applyed', '_access_key'].includes(d[0]))),
        },
      },
    };
  }
);
