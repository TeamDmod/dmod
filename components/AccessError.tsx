import { clsx } from 'lib/constants';
import { useRouter } from 'next//router';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccessError() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.query._access || typeof router.query._access !== 'string') return;
    setOpen(router.query._access === '0');
  }, [router.query._access]);

  return (
    <div>
      <div
        className={clsx('absolute inset-0 h-screen w-full transform duration-150', open ? 'visible scale-100' : 'invisible scale-50 opacity-5')}
        onClick={e => {
          const model = document.getElementById('model-8w');
          const modelBold = document.getElementById('model-b8u');
          const modelBetaText = document.getElementById('model-bet8u');

          if (e.target !== model && e.target !== modelBold && e.target !== modelBetaText) {
            e.preventDefault();
            setOpen(false);
            router.push({ query: { _access: null } });
          }
        }}
      >
        <div className={clsx('flex flex-wrap h-full justify-center content-center bg-gray-900', open ? 'bg-opacity-80' : 'bg-opacity-0')}>
          <div id='model-8w' className='bg-red-700 rounded px-3 py-5'>
            <span className='mr-1 font-bold cursor-pointer text-gray-800'>X</span>
            <b id='model-b8u'>
              Opps looks like you dont have access to login. Make sure your in{' '}
              <Link href='/discord'>
                <span className='text-blue-400 cursor-pointer'>dmod.gg server</span>
              </Link>{' '}
              and have the{' '}
              <span id='model-bet8u' className='text-blue-400'>
                beta
              </span>{' '}
              role.
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}
