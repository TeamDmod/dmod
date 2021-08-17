import MetaTags from 'components/MetaTags';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Discord() {
  const router = useRouter();

  useEffect(() => {
    router.replace('https://discord.com/invite/429zwpugYf');
  }, []);

  return (
    <>
      <MetaTags
        title='Dmod Discord'
        description='The official dmod.gg Discord server! Join us to learn how we are innovating the Moderation Community.'
      />
      <main>
        <h1>
          <small>Redirecting...</small>
        </h1>
      </main>
    </>
  );
}
