import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { sessionFetchedUser } from 'typings/typings';

function Navbar({ user }: { user: sessionFetchedUser }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navbarLinks = [
    // {
    //   name: 'Apply',
    //   link: '/apply',
    // },
    // {
    //   name: 'Profile',
    //   link: '/profile',
    // },
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
        <Link href='/'>
          <img className='logo select-none' draggable={false} src={'/logo.png'} alt='dmod.gg logo' />
        </Link>
        <div>
          <div className='lg:hidden'>
            <div className='cursor-pointer' onClick={() => setOpen(!open)}>
              <svg width='26' height='15' viewBox='0 0 26 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect width='26' height='3' rx='1.5' fill='#F9F9F9' />
                <rect y='6' width='26' height='3' rx='1.5' fill='#F9F9F9' />
                <rect y='12' width='26' height='3' rx='1.5' fill='#F9F9F9' />
              </svg>
            </div>

            {open && (
              <div className='absolute top-0 left-0 w-full text-white px-4 py-1 md:px-24 lg:px-8'>
                <div className='p-5 bg-gray-800 rounded shadow-sm'>
                  <div className='flex items-center justify-between'>
                    <div className='flex space-x-1'>
                      <img className='logo select-none' src={'/logo.png'} draggable={false} alt='dmod.gg logo' onClick={() => router.push('/')} />
                      <span className='flex flex-wrap content-center text-xl font-medium cursor-pointer' onClick={() => router.push('/')}>
                        Dmod
                      </span>
                    </div>
                    <div onClick={() => setOpen(!open)} className='hover:bg-gray-700 rounded p-2 cursor-pointer'>
                      <svg width='19' height='21' viewBox='0 0 19 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <rect y='18.6446' width='24.3388' height='2.80832' rx='1' transform='rotate(-50 0 18.6446)' fill='#FBFBFB' />
                        <rect x='2.62433' y='0.395752' width='24.3388' height='2.80832' rx='1' transform='rotate(50 2.62433 0.395752)' fill='#FBFBFB' />
                      </svg>
                    </div>
                  </div>

                  <div className='flex flex-row ml-5 space-x-4 text-xl'>
                    {navbarLinks.map((link, i) => {
                      return (
                        <Link key={i} href={link.link}>
                          {link.name}
                        </Link>
                      );
                    })}
                    {/* TODO: add user dropdown here */}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='hidden lg:block'>
            <div className='flex flex-row w-full space-x-3'>
              {navbarLinks.map((link, i) => {
                return (
                  <div className='inline-block' key={i}>
                    <Link href={link.link}>{link.name}</Link>
                  </div>
                );
              })}

              {user && user['awaiting'] && <span>Loading user data</span>}

              {user && !user['awaiting'] && (
                // TODO: make user drop down
                <div className='space-x-2'>
                  <Link href={`/${user.vanity}`}>{user.username}</Link>
                  <button onClick={() => router.push('/api/auth/logout')}>Logout</button>
                </div>
              )}

              {!user && (
                <button className='' onClick={() => router.push('/api/auth/login')}>
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
