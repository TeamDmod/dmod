import '../styles/globals.scss';
import '../styles/global.css';
import 'tailwindcss/tailwind.css';
import '../styles/navbar.scss';
import Navbar from '../components/Navbar';
import '../styles/calender.scss';
import { useEffect, useState } from 'react';
import { sessionFetchedUser } from 'typings/typings';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState<sessionFetchedUser>({ awaiting: true });

  useEffect(() => {
    user &&
      user['awaiting'] &&
      fetch(`${window.origin}/api/auth/current_user`)
        .then(d => d.json())
        .then(({ user: _user }) => setUser(_user));
  }, [user]);

  return (
    <>
      <Navbar user={user} />
      <Component {...{ ...pageProps, user }} />
    </>
  );
}
