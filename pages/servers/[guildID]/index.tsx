import Layout from 'components/layout';
import { resolveGuildMemberPerms } from 'lib/backend-utils';
// import crypto from 'crypto-js';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
// import credentials from 'models/credentials';
import guilds, { GuildData } from 'models/guilds';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { RawGuild, RawGuildMember, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  failed: boolean;
  isManager: boolean;
  guild: RawGuild & GuildData;
}

export default function guildView({ failed }: props) {
  if (failed) {
    return (
      <Layout>
        <div>Something went wrong loading data! try again in a bit.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>Guilds view</div>
    </Layout>
  );
}

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');

    const guildData = await guilds.findOne({ _id: context.query.guildID as string });
    if (!guildData) return { notFound: true };

    const authHead = { headers: { Authorization: `Bot ${process.env.CLIENT_TOKEN}` } };

    const guild: RawGuild = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}?with_counts=true`, authHead).then(json);
    // @ts-expect-error
    if (guild.code || guild.message) return { props: { failed: true } };

    let member: RawGuildMember = null;
    if (session.id) member = await fetch(`${API_ENDPOINT}/guilds/${context.query.guildID}/members/${session.id}`, authHead).then(json);
    // @ts-expect-error
    if (member.code || member.message) return { props: { failed: true } };

    const memberPerms = member ? resolveGuildMemberPerms(guild, member) : 0;

    const isManager = (memberPerms & 0x20) === 0x20;

    if (!isManager && (!guildData.completed || !guildData.view)) return { notFound: true };

    return {
      props: {
        isManager,
        failed: false,
        guild: {
          ...Object.fromEntries(Object.entries(guildData.toObject()).filter(d => !['applyed', '_access_key'].includes(d[0]))),
          ...guild,
        },
      },
    };
  }
);
