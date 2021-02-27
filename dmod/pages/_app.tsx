import '../styles/globals.css'
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return ( 
    <>
      <Head>
        <title>Find Server Moderators - Dmod.gg </title>
      </Head>
      <Component {...pageProps} />
    </> 
  );
}

export default MyApp
