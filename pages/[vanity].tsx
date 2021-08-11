import MetaTags from 'components/MetaTags';
import Profile from 'components/user/profile';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import users, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React from 'react';
import { ApiUser, withSessionGetServerSideProps } from 'typings/typings';

interface props {
  profile: userData;
  isOwner: boolean;
  user: ApiUser;
}

export default function userProfile({ profile }: props) {
  return (
    <>
      <MetaTags title={`Dmod.gg - ${profile.username}`} description={`${profile.username}'s profile`} image={profile.avatarURL} />
      <Profile profile={profile} />
    </>
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
          profile: user.toObject(),
          isOwner: !!session && user.id === session.id,
        },
      };
    }

    return {
      notFound: true,
    };
  }
);
