import styles from 'styles/navbar.module.scss';
import { ApiUser } from 'typings/typings';

import UserDropDown from './userDropDown';

export default function UserLoader({
  user,
  oplm,
  fetcher,
}: {
  user: ApiUser;
  oplm: () => void;
  fetcher: any;
}) {
  return (
    <>
      {user && Object.prototype.hasOwnProperty.call(user, 'awaiting') && <div className={styles.load} />}

      {user && !Object.prototype.hasOwnProperty.call(user, 'awaiting') && (
        <UserDropDown fetcher={fetcher} user={user} />
      )}

      {!user && (
        <button className={styles.login} onClick={oplm}>
          Login
        </button>
      )}
    </>
  );
}
