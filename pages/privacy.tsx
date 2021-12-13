import MetaTags from 'components/MetaTags';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Privacy() {
  const router = useRouter();

  useEffect(() => {
    router.replace('https://vgbnd.notion.site/Privacy-Policy-241c8f91662b46ee99928e4dc15732d6');
  }, []);

  return (
    <>
      <MetaTags
        title='Dmod Privacy Policy'
        description='The Privacy Policy of Dmod.gg!'
      />
      <main>
        <h1>
          <small>Redirecting...</small>
        </h1>
      </main>
    </>
  );
}