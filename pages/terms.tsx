import MetaTags from 'components/MetaTags';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Terms() {
  const router = useRouter();

  useEffect(() => {
    router.replace('https://vgbnd.notion.site/Terms-of-Service-619c5e294f354423b34018ca618bd1c6');
  }, []);

  return (
    <>
      <MetaTags
        title='Dmod Terms of Service'
        description='The Terms of Service of Dmod.gg!'
      />
      <main>
        <h1>
          <small>Redirecting...</small>
        </h1>
      </main>
    </>
  );
}