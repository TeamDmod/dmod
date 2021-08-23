import Metatags from 'components/MetaTags';
import { resolveGuildMemberPerms } from 'lib/backend-utils';
import { discordAuthApi } from 'lib/discordAPI';
import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import withSession from 'lib/session';
import guilds, { GuildData } from 'models/guilds';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { RawGuild, RawGuildMember, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  guild: RawGuild & GuildData & { guild_description: string };
  // uid: string;
}

export default function ApplicationEdit({ guild }: props) {
  return (
    <div className='main'>
      <Metatags title={`Editing - ${guild.name}' application`} />
    </div>
  );
}

const TIME = 60 * 60 * 2; // 2h in seconds

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');
    if (!session) return { notFound: true };

    const guildData = await guilds.findOne({ _id: context.query.guildID as string });
    if (!guildData) return { notFound: true };

    const guildCache = await redis.get(`guild:${context.query.guildID}`);
    let guild: RawGuild;
    if (!guildCache) {
      guild = (
        await discordAuthApi
          .guilds(context.query.guildID as string)
          .get<RawGuild>({ query: { with_counts: true } })
      ).body;
      // @ts-expect-error
      if (guild.code || guild.message) return { notFound: true };

      await redis.setex(`guild:${context.query.guildID}`, TIME, JSON.stringify(guild));
    } else {
      guild = JSON.parse(guildCache);
    }

    const limited = await redis.get('limited?type=memberfetch');
    let isLimited: boolean;
    if (!limited) {
      isLimited = false;
    } else {
      isLimited = Number(limited) === 1;
    }

    let memberPerms: number = 0;
    if (!isLimited) {
      let member: RawGuildMember = null;
      if (session?.id) {
        const Member = await discordAuthApi
          .guilds(context.query.guildID as string)
          .members(session.id)
          .get<RawGuildMember>();

        if (Member.headers['x-ratelimit-remaining'] === '0') {
          const waitTime = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
          redis.setex('limited?type=memberfetch', waitTime, 1).then(value => {
            if (value === 'OK')
              console.log(
                'Entered "ratelimit-remaining" of 0. ',
                `Set limted for member fetching true for ${waitTime} seconds`
              );
            else console.log('OPPS!!! Faild to set a limiting mark for member fetching. ', value);
          });
        }
        member = Member.body;
      }
      // @ts-expect-error
      if (member && (member.code || member.message)) return { props: { failed: true } };

      memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;

      if (session?.id)
        await redis.setex(`server:${context.query.guildID}:member:${session.id}`, 60 * 5, memberPerms);
    } else if (session?.id) {
      const perms = await redis.get(`server:${context.query.guildID}:member:${session.id}`);
      memberPerms = Number(perms);
    }

    const isManager = (memberPerms & 0x20) === 0x20;

    if (!isManager) return { notFound: true };

    return {
      props: {
        uid: session.id,
        guild: {
          ...Object.fromEntries(Object.entries(guild).filter(([prop]) => prop !== 'roles')),
          guild_description: guild.description,
          ...guildData.toObject(),
        },
      },
    };
  }
);
