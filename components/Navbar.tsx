import Link from 'next/link';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import styles from 'styles/navbar.module.scss';

import UserLoader from './user/Loader';

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

export default function Navbar() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [active, setActive] = useState(false);

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
        <UserLoader />
      </nav>
    </header>
  );
}
