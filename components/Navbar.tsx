import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ApiUser, sessionFetchedUser } from 'typings/typings';

import UserDropDown from './userDropDown';

function UserLoader({ user }: { user: ApiUser }) {
  const router = useRouter();

  return (
    <div>
      <div className='flex flex-wrap content-center flex-row w-full h-full'>
        {user && Object.prototype.hasOwnProperty.call(user, 'awaiting') && (
          <div>
            <div className='animate-pulse flex flex-wrap content-center space-x-3 h-full'>
              <div className='bg-gray-600 rounded-full h-9 sm:h-11 w-9 sm:w-11' />
              {/* <div className='hidden sm:flex flex-wrap content-center'>
                <div className='bg-gray-600 w-20 h-6 rounded'></div>
              </div> */}
            </div>
          </div>
        )}

        {user && !Object.prototype.hasOwnProperty.call(user, 'awaiting') && (
          <UserDropDown user={user} />
        )}

        {!user && (
          <button
            className='login'
            onClick={() => router.push('/api/auth/login')}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

function XmarkerIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M 0 0 l 20 20 M 20 0 l -20 20'
        fill='#F9F9F9'
        stroke='#F9F9F9'
        strokeWidth='3'
      />
    </svg>
  );
}

function BurgerMenuIcon() {
  return (
    <svg
      width='26'
      height='15'
      viewBox='0 0 26 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <rect width='26' height='3' rx='1.5' fill='#F9F9F9' />
      <rect y='6' width='26' height='3' rx='1.5' fill='#F9F9F9' />
      <rect y='12' width='26' height='3' rx='1.5' fill='#F9F9F9' />
    </svg>
  );
}

function Navbar({ user }: { user: sessionFetchedUser }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
            <BurgerMenuIcon />
          </div>
        </div>

        <div>
          <Link href='/'>
            <img
              className='logo select-none'
              draggable={false}
              src='/logo.png'
              alt='dmod.gg logo'
            />
          </Link>
        </div>

        {open && (
          <div className='absolute top-0 left-0 w-full text-white px-4 py-1 md:px-24 lg:px-8 z-50'>
            <div className='p-5 bg-dorpdown rounded shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='flex space-x-1'>
                  <img
                    className='logo select-none'
                    src='/logo.png'
                    draggable={false}
                    alt='dmod.gg logo'
                    onClick={() => router.push('/')}
                  />
                  <span
                    className='flex flex-wrap content-center text-xl font-medium cursor-pointer'
                    onClick={() => router.push('/')}>
                    Dmod
                  </span>
                </div>
                <div
                  onClick={() => setOpen(!open)}
                  className='hover:bg-gray-700 rounded p-2 cursor-pointer'>
                  <XmarkerIcon />
                </div>
              </div>

              <div className='flex flex-col text-xl text-center'>
                {navbarLinks.map(link => {
                  return (
                    <Link key={link.name} href={link.link}>
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <UserLoader user={user} />
      </div>

      <div className='hidden w-full sm:flex'>
        <div className='w-full flex space-x-3'>
          <Link href='/'>
            <img
              className='logo select-none'
              draggable={false}
              src='/logo.png'
              alt='dmod.gg logo'
            />
          </Link>

          <div className='flex flex-row w-full space-x-3 '>
            {navbarLinks.map(link => {
              return (
                <span key={link.name} className='flex flex-wrap content-center'>
                  <Link href={link.link}>{link.name}</Link>
                </span>
              );
            })}
          </div>
        </div>

        <div className='flex flex-wrap w-full justify-end'>
          <UserLoader user={user} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
