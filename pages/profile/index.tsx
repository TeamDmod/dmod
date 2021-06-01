import Layout from 'components/layout';
import { evalBadges, evalFlags } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import users, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { Session } from 'next-iron-session';
import React from 'react';

interface props {
  profile: userData;
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);

  return (
    <Layout title={`dmod.gg - ${profile.username}`} description='User profile view'>
      <div>
        <div className='h-60 md:h-44 overflow-x-hidden'>
          <div
            className='h-full w-full rounded-b max-h-screen bg-repeat'
            style={{
              backgroundImage: `url(https://cdn.discordapp.com/attachments/728814703266234438/848969373120856114/original_3.gif)`,
              backgroundSize: '100% ',
              minWidth: '500px',
            }}
          />
          {/* {profile.banner && (
            <div
              className='h-full w-full rounded-b max-h-screen bg-repeat'
              style={{
                backgroundImage: `url(${profile.banner})`,
                backgroundSize: '100% ',
                minWidth: '500px',
              }}
            />
          )}
          {!profile.banner && <div className='bg-purple-900 h-full w-full rounded-b' />} */}
        </div>
        <div className='flex flex-wrap md:flex-row flex-col -my-14 content-center ml-0 md:ml-9 space-x-0 md:space-x-3'>
          <img className='rounded-full h-32 w-32' draggable={false} src={profile.avatarURL} alt='User avatar' />
          <span className='flex flex-wrap content-center text-xl'>
            <span>{profile.tag}</span>
          </span>

          <div className='flex flex-wrap content-center space-x-4 mt-1 mb-3'>
            {badges.map((Elm, i) => (
              <span key={'badges' + i}>{Elm}</span>
            ))}
          </div>
        </div>{' '}
        <div className='mt-16'>
          <div>{profile.description}</div>
        </div>
      </div>
    </Layout>
  );
}

type withSessionGetServerSideProps = GetServerSidePropsContext & { req: { session: Session } };
export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');

    if (!session) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false,
        },
      };
    }

    const user = await users.findOne({ _id: session.id });

    if (!user) {
      return {
        redirect: {
          destination: '/api/auth/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        profile: user.toObject(),
      },
    };
  }
);
