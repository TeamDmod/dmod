import MetaTags from 'components/MetaTags';
import Link from 'next/link';
import styles from 'styles/error.module.scss';

export default function Error() {
  return (
    <>
      <MetaTags title='Dmod - 404 not found!' description='Page not found.' />
      <main className={styles.error}>
        <div className={styles.content}>
          <div>
            <h2>404 Error</h2>
            <p>
              You’ve landed somewhere you’re not supposed to be! Press the
              button below to return to safety 👀
            </p>
            <Link href='/'>
              <button>Go Home</button>
            </Link>
          </div>
          <img src='notfound_dud.svg' draggable={false} alt='404 error' />
        </div>
      </main>
    </>
  );
}
