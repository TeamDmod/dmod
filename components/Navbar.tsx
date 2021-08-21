import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from 'styles/navbar.module.scss';
import { sessionFetchedUser } from 'typings/typings';

import UserLoader from './user/userLoader';

function BurgerIcon() {
  return (
    <svg
      width={48}
      height={48}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width={48}
      height={48}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4L18 18M18 4L4 18' />
    </svg>
  );
}

export default function Navbar({ user, fetcher }: { user: sessionFetchedUser; fetcher: any }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [active, setActive] = useState(false);
  const [winlogOpen, setWinlogOpen] = useState(false);
  const router = useRouter();

  function openLoginWindow() {
    if (winlogOpen) return;
    const left = screen.width / 2 - 480 / 2;
    const top = screen.height / 2 - 800 / 2;
    const win = window.open(
      `${window.location.origin}/api/auth/login`,
      '',
      `width=480,height=800,resizable=no,top=${top},left=${left}`
    );
    setWinlogOpen(true);

    const close_inter = setInterval(async () => {
      if (win.closed) {
        setWinlogOpen(false);
        if (!localStorage.getItem('reject')) {
          fetcher(true);
        } else {
          localStorage.removeItem('reject');
          router.push({ query: { _access: 0 } });
        }
        clearInterval(close_inter);
      }
    }, 1000);
  }

  const links = [
    // {
    //   name: 'Listings',
    //   link: '/listings',
    // },
    {
      name: 'Servers',
      link: '/servers',
    },
    {
      name: 'Moderators',
      link: '/moderators',
    },
    {
      name: 'Discord',
      link: '/discord',
    },
  ];

  // <UserLoader oplm={openLoginWindow} fetcher={fetcher} user={user} />

  return (
    <header className={styles.navbar}>
      <nav>
        <Link href='/'>
          <img src='/logo.png' alt='dmod.gg logo' width={48} height={48} className={styles.logo} />
        </Link>
        {isMobile &&
          ((!active && (
            <button onClick={() => setActive(!active)} name='menu' className={styles.menu}>
              <BurgerIcon />
            </button>
          )) ||
            (active && (
              <button onClick={() => setActive(!active)} name='menu' className={styles.menu}>
                <CrossIcon />
              </button>
            )))}
        {(!isMobile || active) && (
          <ul>
            {links.map(link => {
              return (
                <li key={link.name}>
                  <Link href={link.link}>{link.name}</Link>
                </li>
              );
            })}
          </ul>
        )}
        <UserLoader oplm={openLoginWindow} fetcher={fetcher} user={user} />
      </nav>
    </header>
  );
}
