import MetaTags from 'components/MetaTags';
import Profile from 'components/user/Profile';
import clientPromise from 'lib/mongodb';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';
import { ApiUser } from 'typings/typings';

interface props {
  profile: any;
  isOwner: boolean;
  user: ApiUser;
}

export default function userProfile({ profile }: props) {
  return (
    <>
      <MetaTags
        title={`Dmod.gg - ${profile.username}`}
        description={`${profile.username}'s profile`}
        image={profile.avatar}
      />
      <Profile profile={profile} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const client = await clientPromise;
  const db = client.db();
  const session: { user: ApiUser } = (await getSession(context)) as unknown as { user: ApiUser };

  const user = JSON.parse(
    JSON.stringify(await db.collection('users').findOne({ vanity: context.query.vanity as string }))
  );
  const isOwner = session?.user?.id === user?._id;

  if (user?.public || isOwner) {
    const data = {
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      bio: user.bio || '',
    };

    return {
      props: {
        profile: data,
        isOwner,
      },
    };
  }

  return {
    notFound: true,
  };
};
