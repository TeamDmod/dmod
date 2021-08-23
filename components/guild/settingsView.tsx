import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

// TODO: move to scss. development only
const SettingsView: React.FC<{}> = ({ children }) => {
  const router = useRouter();
  const gotos = [
    ['Edit server', ''],
    ['Edit Application', '/application/edit'],
  ];

  const makeBase = (str: string) => `/servers/${router.query.guildID}/settings${str}`;

  const manageReclick = useMemo(() => {
    return (path: string) => {
      if (makeBase(path) === router.asPath) return;
      router.push({ pathname: makeBase(path) });
    };
  }, []);

  return (
    <div className='main'>
      <div>
        <ul>
          {gotos.map(([name, href]) => (
            <li key={name + href}>
              <span onClick={() => manageReclick(href)} className='cursor-pointer select-none'>
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SettingsView;
