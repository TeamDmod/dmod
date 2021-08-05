import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';

export default function Footer() {
  const router = useRouter();

  return (
    <footer>
      <div id='logo-copyright'>
        <Link href='/'>
          <img
            src='/logo.png'
            width='180px'
            className='pointer'
            alt='dmod logo'
          />
        </Link>
        <span>
          <p>© dmod.gg {new Date().getFullYear()}</p>
          <p>All rights reserved.</p>
          <p>Not affiliated with Discord.</p>
        </span>
      </div>
      <div id='divider' />
      <div className='links'>
        <h1>Discord Moderation at your fingertips!</h1>
        <div id='pages'>
          <h2>Pages</h2>
          <li>
            <Link href='/'>Home</Link>
          </li>
        </div>
        <div>
          <h2>Legal</h2>
          <li>
            <Link href='/terms-of-service'>Terms of Service</Link>
          </li>
          <li>
            <Link href='/privacy-policy'>Privacy Policy</Link>
          </li>
        </div>
      </div>
    </footer>
  );
}
