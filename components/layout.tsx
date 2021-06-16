import Head from 'next/head';

interface props {
  title?: string;
  description?: string;
  image?: string;
  children: React.ReactNode;
}

export default function Layout({ title = 'dmod.gg', description = 'The best place to hire moderators!', image = '/logo.png', children }: props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@dmod.gg' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={image} />

        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={image} />
        <link rel='icon' href='/logo.png' />
      </Head>
      {children}
    </>
  );
}
