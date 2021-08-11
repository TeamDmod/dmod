import MetaTags from 'components/MetaTags;
import { useRouter } from 'next/router';
import React from 'react';

export default function Error() {
  const router = useRouter();

  return (
    <>
    <MetaTags title='Dmod - 404 not found!' description='Page not found.'>
      <div className='flex flex-row w-full px-5'>
        <div className='flex flex-wrap content-center text-center w-full'>
          <div className='flex flex-wrap flex-col content-center text-xl space-y-2 w-full'>
            <h1 className='font-semibold text-4xl'>404 Error!</h1>
            <h3>Yikes! You've landed somewhere you're not supposed to be!</h3>
            <button
              onClick={() => {
                router.push('/');
              }}
              className='focus:outline-none bg-buttonsbg rounded-md px-4 py-2'
            >
              Go home!
            </button>
          </div>
        </div>

        <div className='hidden md:flex flex-wrap content-center h-3/4 w-3/4'>
          <img className='select-none' draggable={false} src='/notfound_dud.svg' alt='Not Found.' />
        </div>
      </div>
    </>
  );
}
