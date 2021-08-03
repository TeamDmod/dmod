import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { sessionFetchedUser } from 'typings/typings';

import UserLoader from './user/userLoader';

function XmarkerIcon() {
  return (
    <svg width='19' height='21' viewBox='0 0 19 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect y='18.6446' width='24.3388' height='2.80832' rx='1' transform='rotate(-50 0 18.6446)' fill='#FBFBFB' />
      <rect x='2.62433' y='0.395752' width='24.3388' height='2.80832' rx='1' transform='rotate(50 2.62433 0.395752)' fill='#FBFBFB' />
    </svg>
  );
}

function BergerMenuIcon() {
  return (
    <svg width='26' height='15' viewBox='0 0 26 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='26' height='3' rx='1.5' fill='#F9F9F9' />
      <rect y='6' width='26' height='3' rx='1.5' fill='#F9F9F9' />
      <rect y='12' width='26' height='3' rx='1.5' fill='#F9F9F9' />
    </svg>
  );
}

function Navbar({ user, fetcher }: { user: sessionFetchedUser; fetcher: any }) {
  const [open, setOpen] = useState(false);
  const [winlogOpen, setWinlogOpen] = useState(false);
  const router = useRouter();

  function openLoginWindo() {
    if (winlogOpen) return;
    const left = screen.width / 2 - 480 / 2;
    const top = screen.height / 2 - 800 / 2;
    const win = window.open(`${window.location.origin}/api/auth/login`, '', `width=480,height=800,resizable=no,top=${top},left=${left}`);
    setWinlogOpen(true);

    const close_inter = setInterval(async () => {
      if (win.closed) {
        setWinlogOpen(false);
        fetcher(true);
        clearInterval(close_inter);
      }
    }, 1000);
  }

  const navbarLinks = [
    // {
    //   name: 'Listings',
    //   link: '/listings',
    // },
    {
      name: 'Servers',
      link: '/servers',
    },
    {
      name: 'Discord',
      link: '/discord',
    },
  ];

  return (
    <header className='px-10 py-3'>
      <div className='sm:hidden flex w-full justify-between'>
        <div className='flex flex-wrap content-center'>
          <div className='cursor-pointer' onClick={() => setOpen(!open)}>
            <BergerMenuIcon />
          </div>
        </div>

        <div>
          <Link href='/'>
            <img className='logo select-none' draggable={false} src='/logo.png' alt='dmod.gg logo' />
          </Link>
        </div>

        {open && (
          <div className='absolute top-0 left-0 w-full text-white px-4 py-1 md:px-24 lg:px-8 z-50'>
            <div className='p-5 bg-dorpdown rounded shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='flex space-x-1'>
                  <img className='logo select-none' src='/logo.png' draggable={false} alt='dmod.gg logo' onClick={() => router.push('/')} />
                  <span className='flex flex-wrap content-center text-xl font-medium cursor-pointer' onClick={() => router.push('/')}>
                    Dmod
                  </span>
                </div>
                <div onClick={() => setOpen(!open)} className='hover:bg-gray-700 rounded p-2 cursor-pointer'>
                  <XmarkerIcon />
                </div>
              </div>

              <div className='flex flex-row ml-5 space-x-4 text-xl'>
                {navbarLinks.map((link, i) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Link key={i} href={link.link}>
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <UserLoader oplm={openLoginWindo} fetcher={fetcher} user={user} />
      </div>

      <div className='hidden w-full sm:flex'>
        <div className='w-full flex space-x-3'>
          <Link href='/'>
            <img className='logo select-none' draggable={false} src='/logo.png' alt='dmod.gg logo' />
          </Link>

          <div className='flex flex-row w-full space-x-3 '>
            {navbarLinks.map((link, i) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <span key={i} className='flex flex-wrap content-center'>
                  <Link href={link.link}>{link.name}</Link>
                </span>
              );
            })}
          </div>
        </div>

        <div className='flex flex-wrap w-full justify-end'>
          <UserLoader oplm={openLoginWindo} fetcher={fetcher} user={user} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
