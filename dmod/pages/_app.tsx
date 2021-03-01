import '../styles/globals.scss';
import '../styles/navbar.scss';
import Navbar from '../components/navigation/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return ( 
    <>
      <Head>
        <title>Find Server Moderators - Dmod.gg </title>
      </Head>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </> 
  );
}

export default MyApp
