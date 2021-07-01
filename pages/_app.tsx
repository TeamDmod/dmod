// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';
import '../styles/global.css';
import '../styles/navbar.scss';
import '../styles/calender.scss';

import Navbar from 'components/Navbar';
import { useEffect, useState } from 'react';
import { sessionFetchedUser } from 'typings/typings';

export default function App({ Component, pageProps }: any) {
  const [user, setUser] = useState<sessionFetchedUser>({ awaiting: true } as any);

  useEffect(() => {
    user &&
      // eslint-disable-next-line @typescript-eslint/dot-notation
      user['awaiting'] &&
      fetch(`${window.origin}/api/auth/current_user`)
        .then(d => d.json())
        .then(({ user: _user }) => setUser(_user));
  }, [user]);

  return (
    <>
      <Navbar user={user} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...{ ...pageProps, user }} />
    </>
  );
}
