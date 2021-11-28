import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import styles from 'styles/navbar.module.scss';
import { ApiUser } from 'typings/typings';

import UserDropDown from './DropDown';

export default function UserLoader() {
  const { data: session, status } = useSession();
  // const [open, setOpen] = useState(false);

  // const openLoginWindow = () => {
  //   if (open) return;

  //   const left = screen.width / 2 - 480 / 2;
  //   const top = screen.height / 2 - 800 / 2;
  //   const win = window.open(
  //     `${window.location.origin}/api/auth/signin/discord`,
  //     '',
  //     `width=480,height=800,resizable=no,top=${top},left=${left}`
  //   );

  //   setOpen(true);

  //   const close = setInterval(async () => {
  //     if (win.closed) {
  //       setOpen(false);
  //       clearInterval(close);
  //     }
  //   }, 1000);
  // };

  if (status === 'loading') {
    return <div className={styles.load} />;
  }

  if (status === 'authenticated') {
    return <UserDropDown user={session.user as ApiUser} />;
  }

  return (
    <button className={styles.login} onClick={() => signIn('discord')}>
      Login
    </button>
  );
}
