import '../styles/globals.scss';
import '../styles/navbar.scss';
import { Provider } from 'react-redux';
import Navbar from '../components/navigation/Navbar';
import Head from 'next/head';
import store from '../redux/store';
import "../styles/calender.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>Find Server Moderators - Dmod.gg </title>
        </Head>
        <Navbar></Navbar>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

const makeStore = () => store;

export default MyApp
