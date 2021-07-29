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
    <div id='access_error-sdf'>
      <div
        className={clsx('absolute inset-0 h-screen w-full transform duration-300', open ? 'visible' : 'invisible opacity-5')}
        onClick={e => {
          const model = document.getElementById('model-8w');
          const modelBold = document.getElementById('model-b8u');
          const modelBetaText = document.getElementById('model-bet8u');
          const close = document.getElementById('model-x7b');
          const head = document.getElementById('model-91');

          if (e.target !== model && e.target !== modelBold && e.target !== modelBetaText && e.target !== close && e.target !== head) {
            e.preventDefault();
            setOpen(false);
            router.push({ query: { _access: null } });
          }
        }}
      >
        <div className={clsx('transform duration-100 flex flex-wrap h-full justify-center content-center bg-gray-900', open ? 'bg-opacity-80' : 'bg-opacity-0')}>
          <div id='model-8w' className={clsx('rounded px-3 pb-5 pt-2 flex flex-col', open && 'model-fhi')}>
            <span id='model-x7b' className='mr-1 font-bold text-gray-800 text-right'>
              <span className='cursor-pointer'>X</span>
            </span>
            <b id='model-b8u'>
              <h1 id='model-91' className='text-red-600'>
                Access denied
              </h1>
              Oops looks like you don't have access to login. Make sure you're in{' '}
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
// git add components/AccessError.tsx
