import Layout from 'components/layout';
import Metatags from 'components/MetaTags';
import { resolveType } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import withSession from 'lib/session';
import guilds, { GuildData } from 'models/guilds';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import { RawGuild, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  failed: boolean;
  guild: RawGuild & GuildData & { guild_description: string };
  // ws: DmodWebSocket;
  // hasApp: boolean;
  notLogedIn: boolean;
}

export default function Application({ guild, failed, notLogedIn }: props) {
  // const [cantApply, setCantApply] = useState(false);

  if (failed) {
    return (
      <main>
        <h3 className='error'>Something went wrong loading data! try again in a bit... 😔</h3>
      </main>
    );
  }

  const icon = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${resolveType(guild.icon)}`
    : '/icon.png';

  if (notLogedIn) {
    return (
      <main>
        <Metatags
          title={`${guild.name} - Application form`}
          description={`${guild.name} Application form`}
          image={
            guild.banner
              ? `https://cdn.discordapp.com/banners/${guild.id}/${resolveType(guild.banner)}`
              : icon
          }
        />
        <h3 className='error'>Unauthorized. Required login.</h3>
      </main>
    );
  }

  return (
    <main>
      <Metatags
        title={`${guild.name} - Application form`}
        description={`${guild.name} Application form`}
        image={
          guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${resolveType(guild.banner)}` : icon
        }
      />
      <h3>Under Development come back later!</h3>
      <p>
        Go Back to{' '}
        <b>
          <Link href={`/servers/${guild.id}`}>{guild.name}</Link>
        </b>
        ?
      </p>
    </main>
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
      guild = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}?with_counts=true`, authHead).then(
        json
      );
      // @ts-expect-error
      if (guild.code || guild.message) return { props: { failed: true } };

      await redis.setex(`guild:${context.query.guildID}`, TIME, JSON.stringify(guild));

      if (guild.banner)
        await redis.set(
          `guild:${context.query.guildID}:banner`,
          `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}${
            guild.banner.startsWith('a_') ? '.gif' : '.png'
          }`
        );

      if (guild.icon)
        await redis.set(
          `guild:${context.query.guildID}:icon`,
          `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}${
            guild.icon.startsWith('a_') ? '.gif' : '.png'
          }`
        );
    } else {
      guild = JSON.parse(guildCache);
    }

    const guildObj = {
      ...Object.fromEntries(Object.entries(guild).filter(([prop]) => prop !== 'roles')),
      guild_description: guild.description,
      ...Object.fromEntries(Object.entries(guildData.toObject()).filter(d => d[0] !== 'applyed')),
    };

    if (!session?.id)
      return {
        props: {
          notLogedIn: true,
          guild: guildObj,
        },
      };

    return {
      props: {
        failed: false,
        hasApp: guildData.applyed.includes(session.id),
        guild: guildObj,
      },
    };
  }
);
