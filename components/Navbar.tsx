import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

function Navbar() {
  const router = useRouter()
  const navbarLinks = [
    {
      name: 'Apply',
      link: '/apply',
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
        <button className="lgn primary-button" onClick={() => router.push('/') /* login route (gana work on that maybe leter) */}>
          Login
          {/* <button className="">Login</button>
            <Link href="http://localhost:4000/login"></Link> */}
        </button>
      </header>
    </div>
  );
}

export default Navbar;
