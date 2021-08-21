import '../styles/globals.scss';
import '../styles/link.scss';
import 'nprogress/nprogress.css';

import Navbar from 'components/Navbar';
import { isServer } from 'lib/isServer';
import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect, useState } from 'react';
import { sessionFetchedUser } from 'typings/typings';
import DmodWebSocket from 'websocket';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
const accessTokenKey = '@pup/token';
const gatewayHashKey = '@pup/hash';

export default function App({ Component, pageProps }: any) {
  const [user, setUser] = useState<sessionFetchedUser>({
    awaiting: true,
  } as any);
  const [shouldFetchU, setUfetch] = useState(true);
  const [gwr, setGwr] = useState(false);
  // socketConnected, socketMessage implement back later
  const [, setConnected] = useState(false);
  const [, setSocketMessage] = useState<null | string>(null);

  function getcc(): { token: string; gatewayHash: string } {
    if (!isServer) {
      try {
        return {
          token: localStorage.getItem(accessTokenKey) || '',
          gatewayHash: localStorage.getItem(gatewayHashKey) || '',
        };
      } catch (e) {
        console.log(e);
      }
    }

    return {
      token: '',
      gatewayHash: '',
    };
  }

  useEffect(() => {
    if ((user && Object.prototype.hasOwnProperty.call(user, 'awaiting')) || shouldFetchU) {
      if (!shouldFetchU) return;

      gwr && DmodWebSocket.disconnect({ reason: 'RAU' });
      setGwr(false);
      setUfetch(false);

      fetch(`${window.origin}/api/auth/current_user`)
        .then(d => d.json())
        .then(data => {
          setUser(data?.user ?? null);
        });
    }
  }, [shouldFetchU]);

  useEffect(() => {
    if ((user && !Object.prototype.hasOwnProperty.call(user, 'awaiting')) || user === null) {
      if (gwr) return;
      setGwr(true);
      const { gatewayHash } = getcc();

      DmodWebSocket.connect(!user ? undefined : { token: gatewayHash, uid: user.id }).then(() => {
        const qwe = () => {
          console.log('connected');
          setConnected(true);
          // ws.removeListener('ready', qwe);
        };

        DmodWebSocket.on('close', reason => {
          setConnected(false);
          if (['RAU'].includes(reason)) return;
          setSocketMessage(reason);
        });
        DmodWebSocket.on('e', e => setSocketMessage(e.message || e));
        DmodWebSocket.once('ready', qwe);
      });
    }
  }, [user]);

  return (
    <>
      <div id='__jkicl' />
      <div id='__info_j6t' />
      {/* {!socketConnected && (
        <span className='absolute right-1/2 top-1 w-max bg-gray-500 rounded px-1 bg-opacity-40'>
          {socketMessage
            ? `Socket Error: ${socketMessage}`
            : 'Connecting to gateway...'}
        </span>
      )} */}
      <Navbar user={user} fetcher={setUfetch} />
      <Component {...{ ...pageProps, user, ws: DmodWebSocket, __setUser: setUser }} />
    </>
  );
}
