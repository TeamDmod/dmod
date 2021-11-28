import '../styles/globals.scss';
import '../styles/link.scss';
import 'nprogress/nprogress.css';

import Navbar from 'components/Navbar';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.remove());

// TODO: rewrite this mess - rip out gateway stuff
export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <div id='__jkicl' />
      <div id='__info_j6t' />
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
