import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className='bg-footer px-6 pt-1 pb-2 mt-2'>
      <div className='flex flex-wrap justify-between'>
        <div className='footer-left flex flex-wrap items-center justify-center'>
          <div style={{ height: '50px', marginRight: '3px' }} className='cursor-pointer' onClick={() => router.push('/')}>
            <Image src='/logo.png' width='50px' height='50px' />
          </div>
          <span style={{ color: '#A7A7A7' }} className='font-semibold'>
            Discord Moderation at your fingertips!
          </span>
          <div className='ml-4 flex space-x-2'>
            <p className='underline'>
              <Link href='/terms-of-service'>Terms of Service</Link>
            </p>
            <p className='underline'>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </p>
          </div>
        </div>

        <div className='footer-right text-base'>
          <span className='fr-rights flex flex-col items-end'>
            <p>Copyright (C) {new Date().getFullYear()} dmod.gg.</p>
            <p>All rights reserved.</p>
          </span>
          <span className='fr-note'>
            <p>dmod.gg is not affiliated with or in partnership with Discord Inc.</p>
          </span>
        </div>
      </div>
    </footer>
  );
}
