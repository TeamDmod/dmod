import Footer from 'components/footer';
import GuildPreviewCard from 'components/guildPreviewCard';
import Layout from 'components/layout';
import MetaTags from 'components/MetaTags';
import { PreviewGuildData } from 'models/preview_guilds';
import { userData } from 'models/users';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from 'styles/search.module.scss';

export default function Search() {
  const router = useRouter();
  const [guilds, setGuilds] = useState<PreviewGuildData[]>([]);
  const [users, setUsers] = useState<userData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>();

  function request(q: string) {
    Promise.all([
      fetch(`${window.origin}/api/v1/kei/search_g?q=${encodeURIComponent(q)}`).then(async res => {
        const data = await res.json();
        if (data.code || data.message || !Array.isArray(data)) return;
        setGuilds(data);
      }),
      fetch(`${window.origin}/api/v1/kei/search_u?q=${encodeURIComponent(q)}`).then(async res => {
        const data = await res.json();
        if (data.code || data.message || !Array.isArray(data)) return;
        setUsers(data);
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }

  function Get() {
    if (!search) {
      const t = setTimeout(() => {
        if (router.query.q !== undefined) {
          setSearch(router.query.q as string);
          request(router.query.q as string);
          clearTimeout(t);
          return;
        }
        Get();
      }, 350);

      return;
    }

    request(search);
  }

  useEffect(() => {
    if (!router.query.q) return;
    setSearch(router.query.q as string);
    Get();
  }, [router.query.q]);

  function searchRedirect() {
    if (search.length <= 0) return;
    setLoading(true);
    Get();
    router.push(`/search?q=${search}`);
  }

  return (
    <main>
      <MetaTags title='Search results' />
      <div className={styles.top}>
        <h1>Search dmod</h1>
        <div className={styles.search_bar}>
          <input
            placeholder='Search dmod...'
            className={styles.search}
            value={search}
            onChange={({ currentTarget }) => setSearch(currentTarget.value)}
            onKeyDown={ev => {
              if (ev.key === 'Enter') searchRedirect();
            }}
          />
          <button className={styles.search_button} onClick={searchRedirect}>
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div className='loader loader4' />
      ) : (
        <div className='mx-0 sm:mx-4 mt-16 flex flex-col space-x-0 sm:space-x-3 justify-center'>
          <h2 className='mb-1 ml-2'>Users</h2>

          {users.length <= 0 && (
            <div className='text-center w-full mt-4'>
              <span className='text-5xl font-bold'>Nothing found{' :('}</span>
            </div>
          )}

          <div className='w-full flex flex-wrap space-y-2'>
            {users.map(user => {
              return (
                <div
                  key={user._id}
                  className='bg-listingcard p-2 rounded cursor-pointer ml-3'
                  style={{ maxWidth: '17.5rem' }}
                  onClick={() => router.push(`/${user.vanity}`)}>
                  <div className='flex space-x-1'>
                    <img alt='user avatar' src={user.avatarURL} className='rounded-full h-7 w-7' />
                    <p className='text-xl'>{user.username}</p>
                  </div>
                  <p>Active: {user.active ? 'Yes' : 'No'}</p>
                  <p className='truncate'>{user.description.slice(0, 50)}</p>
                </div>
              );
            })}
          </div>

          <span className='my-6' />
          <h2 className='mb-1'>Servers</h2>

          {guilds.length <= 0 && (
            <div className='text-center w-full mt-4'>
              <span className='text-5xl font-bold'>Nothing found{' :('}</span>
            </div>
          )}

          <div className='w-full flex flex-wrap space-y-2'>
            {guilds.map((guild, i) => {
              const time = () => {
                const t = 0.2 * i + 1;
                if (t > 6) return Number(`${i / 4}`);
                return t;
              };

              return (
                <GuildPreviewCard duration={time()} className='gdc-sihf' key={guild._id} guild={guild} />
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
