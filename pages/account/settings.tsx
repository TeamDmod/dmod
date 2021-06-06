import AnimatedLoader from 'components/AnimatedLoader';
import Layout from 'components/layout';
import useUserGard from 'lib/useUserGard';
import React from 'react';

export default function Settings({ user }) {
  const { loading } = useUserGard(user);

  if (loading)
    return (
      <Layout title={`Loading - Settings`}>
        <AnimatedLoader />
      </Layout>
    );

  return <Layout title={`${user.username} - Settings`}>HI</Layout>;
}
