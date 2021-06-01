import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';
import { ApiUser, sessionFetchedUser } from 'typings/typings';

function Navbar({ user }: { user: sessionFetchedUser }) {
  const router = useRouter();

  const navbarLinks = [
    {
      name: 'Apply',
      link: '/apply',
    },
    {
      name: 'Profile',
      link: '/profile',
    },
    {
      name: 'Listings',
      link: '/listings',
    },
    {
      name: 'Discord',
      link: '/discord',
    },
  ];

  return (
    <div>
      <header>
        <Link href="/">
          <img className="logo" src={'/logo.png'} alt="dmod.gg logo"></img>
        </Link>
        <nav>
          <ul className="nav__links">
            {navbarLinks.map((link, i) => {
              return (
                <li key={i}>
                  <Link href={link.link}>
                    <a>{link.name}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {user && user['awaiting'] && <span>Loading user data</span>}

        {user && !user['awaiting'] && (
          <div>
            <span>{(user as ApiUser).username}</span>
            <button onClick={() => router.push('/api/auth/logout')}>Logout</button>
          </div>
        )}

        {!user && (
          <button className="lgn primary-button" onClick={() => router.push('/api/auth/login')}>
            Login
          </button>
        )}
      </header>
    </div>
  );
}

export default Navbar;
