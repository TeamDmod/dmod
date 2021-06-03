import Layout from 'components/layout';
import Profile from 'components/profile';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import users, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ApiUser, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  profile: userData;
  isOwner: boolean;
  user: ApiUser;
}

export default function userProfile({ profile, isOwner, user }: props) {
  const [canChange, setCan] = useState(false);

  useEffect(() => {
    if (!isOwner) return;
    if (!user || user['awaiting']) return;
    if (profile.avatar !== user.avatar || profile.username !== user.username || profile.discriminator !== user.discriminator) setCan(true);
  }, [user]);

  function updateData() {
    console.log('Data updating');
  }

  return (
    <Layout title={`dmod.gg - ${profile.username}`} description='User profile view'>
      <Profile
        profile={profile}
        NoSyncData={
          canChange ? (
            <div className='flex flex-wrap content-center m-3 md:m-0'>
              {/* Update button to update the user profile data from the data pulled form discord. */}
              <div className='text-gray-100 bg-red-600 p-2 rounded cursor-pointer select-none animate-floting' onClick={updateData}>
                Update data!
              </div>
            </div>
          ) : undefined
        }
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');

    const user = await users.findOne({ vanity: context.query.vanity as string });

    if (user) {
      return {
        props: {
          profile: (() => {
            const u = user.toObject();
            u.updates_access = !!session && user.id === session.id ? u.updates_access : null;
            return u;
          })(),
          isOwner: !!session && user.id === session.id,
        },
      };
    }

    return {
      notFound: true,
    };
  }
);
