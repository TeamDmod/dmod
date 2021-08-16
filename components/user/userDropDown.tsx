import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { Fragment } from 'react';
import styles from 'styles/navbar.module.scss';
import { ApiUser } from 'typings/typings';

interface props {
  user: ApiUser;
  fetcher: any;
}

function AccountSettingsIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.5225 20H7.88251C7.41267 20 7.00611 19.673 6.90555 19.214L6.49855 17.33C5.9556 17.0921 5.44078 16.7946 4.96355 16.443L3.12655 17.028C2.67855 17.1709 2.19154 16.9823 1.95655 16.575L0.132554 13.424C-0.099856 13.0165 -0.019786 12.5025 0.325554 12.185L1.75055 10.885C1.68575 10.2961 1.68575 9.7019 1.75055 9.113L0.325554 7.816C-0.0202959 7.49837 -0.100396 6.98372 0.132554 6.576L1.95255 3.423C2.18754 3.0157 2.67455 2.82714 3.12255 2.97L4.95955 3.555C5.20361 3.37416 5.45768 3.20722 5.72055 3.055C5.97289 2.91269 6.23259 2.78385 6.49855 2.669L6.90655 0.787C7.00662 0.32797 7.41274 0.00049 7.88251 0H11.5225C11.9924 0.00049 12.3985 0.32797 12.4985 0.787L12.9105 2.67C13.1913 2.79352 13.4648 2.93308 13.7295 3.088C13.9765 3.23081 14.2152 3.38739 14.4445 3.557L16.2825 2.972C16.7302 2.82967 17.2167 3.01816 17.4515 3.425L19.2715 6.578C19.504 6.98548 19.4239 7.49951 19.0785 7.817L17.6535 9.117C17.7183 9.7059 17.7183 10.3001 17.6535 10.889L19.0785 12.189C19.4239 12.5065 19.504 13.0205 19.2715 13.428L17.4515 16.581C17.2167 16.9878 16.7302 17.1763 16.2825 17.034L14.4445 16.449C14.212 16.6203 13.9703 16.7789 13.7205 16.924C13.4584 17.0759 13.1879 17.2131 12.9105 17.335L12.4985 19.214C12.3981 19.6726 11.992 19.9996 11.5225 20ZM5.32255 14.229L6.14255 14.829C6.3274 14.9652 6.52006 15.0904 6.71955 15.204C6.90725 15.3127 7.10052 15.4115 7.29855 15.5L8.23151 15.909L8.68851 18H10.7185L11.1755 15.908L12.1085 15.499C12.5158 15.3194 12.9024 15.0961 13.2615 14.833L14.0825 14.233L16.1235 14.883L17.1385 13.125L15.5555 11.682L15.6675 10.67C15.7167 10.2274 15.7167 9.7806 15.6675 9.338L15.5555 8.326L17.1395 6.88L16.1235 5.121L14.0825 5.771L13.2615 5.171C12.9023 4.90671 12.5158 4.68175 12.1085 4.5L11.1755 4.091L10.7185 2H8.68851L8.22951 4.092L7.29855 4.5C7.10036 4.58704 6.90707 4.68486 6.71955 4.793C6.52129 4.90633 6.32964 5.03086 6.14555 5.166L5.32455 5.766L3.28455 5.116L2.26755 6.88L3.85055 8.321L3.73855 9.334C3.68935 9.7766 3.68935 10.2234 3.73855 10.666L3.85055 11.678L2.26755 13.121L3.28255 14.879L5.32255 14.229ZM9.69851 14C7.48941 14 5.69855 12.2091 5.69855 10C5.69855 7.79086 7.48941 6 9.69851 6C11.9077 6 13.6985 7.79086 13.6985 10C13.6958 12.208 11.9065 13.9972 9.69851 14ZM9.69851 8C8.60591 8.0011 7.71641 8.8788 7.70078 9.9713C7.68513 11.0638 8.54911 11.9667 9.64121 11.9991C10.7334 12.0315 11.6494 11.1815 11.6985 10.09V10.49V10C11.6985 8.8954 10.8031 8 9.69851 8Z'
        fill='#ADB4C6'
      />
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AdminPanelIcon() {
  return (
    <svg width='21' height='18' viewBox='0 0 21 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M19.533 17.9991H0.999978C0.642718 17.9991 0.312597 17.8085 0.133967 17.4991C-0.0446625 17.1897 -0.0446525 16.8085 0.133978 16.4991L9.39997 0.49909C9.57877 0.1902 9.90857 0 10.2655 0C10.6224 0 10.9522 0.1902 11.131 0.49909L20.397 16.4991C20.5755 16.8083 20.5756 17.1893 20.3973 17.4986C20.2189 17.808 19.8891 17.9987 19.532 17.9991H19.533ZM10.267 2.99909L2.73598 15.9991H17.8L10.267 2.99909ZM11.262 12.0001H9.26197V6.99909H11.262V12.0001Z'
        fill='#ADB4C6'
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width='16' height='18' viewBox='0 0 16 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M5 4L3.6 5.4L6.2 8H-4V10H6.2L3.6 12.6L5 14L10 9L5 4ZM14 16H6V18H14C15.1 18 16 17.1 16 16V2C16 0.9 15.1 0 14 0H6V2H14V16Z'
        fill='#ADB4C6'
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18 18H2C0.89543 18 0 17.1046 0 16V2C0 0.89543 0.89543 0 2 0H18C19.1046 0 20 0.89543 20 2V16C20 17.1046 19.1046 18 18 18ZM2 4V16H18V4H2ZM12.707 13.707L11.294 12.294L13.586 10L11.293 7.707L12.707 6.293L16.414 10L12.708 13.706L12.707 13.707ZM7.293 13.707L3.586 10L7.293 6.293L8.707 7.707L6.414 10L8.706 12.293L7.293 13.706V13.707Z'
        fill='#ADB4C6'
      />
    </svg>
  );
}

const toBack = [
  {
    from: /\/servers\/\d+\/settings\/?$/,
    to: (query: ParsedUrlQuery) => `/servers/${query.guildID}`,
  },
  {
    from: /\/account\/?.*/,
    to: () => `/`,
  },
  {
    from: /\/servers\/?/,
    to: () => `/`,
  },
];

export default function UserDropDown({ user, fetcher }: props) {
  const router = useRouter();

  function LogoutSoft() {
    localStorage.removeItem('@pup/token');
    localStorage.removeItem('@pup/hash');
    const toRedirect = toBack.find(reg => reg.from.test(router.asPath));

    fetch(`${window.location.origin}/api/auth/logout`).then(async () => {
      if (toRedirect) {
        await router.push(toRedirect.to(router.query));
        fetcher(true);
      } else {
        fetcher(true);
      }
    });
  }

  function userAvatarUrl(): string | null {
    let base = `https://cdn.discordapp.com/avatars/${user.id}/`;
    const disc = +user.discriminator;

    if (!user.avatar) return (base = `https://cdn.discordapp.com/embed/avatars/${disc % 5}.png?size=64`);
    const isAnimated = user.avatar.startsWith('a_');
    return (base += `${user.avatar}.${isAnimated ? 'gif' : 'png'}?size=64`);
  }

  return (
    <Menu as={Fragment}>
      <Menu.Button className={styles.user_button}>
        <img className={styles.user_avatar} src={userAvatarUrl()} alt='User Avatar' />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items className={styles.dropdown_items}>
          <Menu.Item>
            <Link href={`/${user.vanity}`}>
              <button>
                <ProfileIcon />
                <span>Profile</span>
              </button>
            </Link>
          </Menu.Item>

          <Menu.Item>
            <Link href='/account/settings'>
              <button>
                <AccountSettingsIcon />
                <span>Settings</span>
              </button>
            </Link>
          </Menu.Item>

          <Menu.Item>
            <button className={styles.logout} onClick={LogoutSoft}>
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
