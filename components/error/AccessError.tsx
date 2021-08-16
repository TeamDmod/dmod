import { clsx } from 'lib/constants';
import { useRouter } from 'next//router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from 'styles/home.module.scss';

function CrossIcon() {
  return (
    <svg
      width={48}
      height={48}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M4 4L18 18M18 4L4 18'
      />
    </svg>
  );
}

export default function AccessError() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.query._access || typeof router.query._access !== 'string')
      return;
    setOpen(router.query._access === '0');
  }, [router.query._access]);

  return (
    <div id='access_error-sdf'>
      <div
        className={clsx(open ? styles.error : 'invisible')}
        onClick={e => {
          const model = document.getElementById('model-8w');
          const modelBold = document.getElementById('model-b8u');
          const modelBetaText = document.getElementById('model-bet8u');
          const close = document.getElementById('model-x7b');
          const head = document.getElementById('model-91');

          if (
            e.target !== model &&
            e.target !== modelBold &&
            e.target !== modelBetaText &&
            e.target !== close &&
            e.target !== head
          ) {
            e.preventDefault();
            setOpen(false);
            router.push({ query: { _access: null } });
          }
        }}>
        <div className={styles.content}>
          <div id='model-8w'>
            <span id='model-x7b' className={clsx(styles.cross, 'pointer')}>
              <CrossIcon />
            </span>
            <div id='model-b8u'>
              <h1 id='model-91'>Access denied</h1>
              <p>
                Oops looks like you don't have access to login. Make sure you're
                in{' '}
                <Link href='/discord'>
                  <a className='text-blue-400 cursor-pointer'>dmod.gg server</a>
                </Link>{' '}
                and have the <b id='model-bet8u'>beta</b> role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// git add components/AccessError.tsx
