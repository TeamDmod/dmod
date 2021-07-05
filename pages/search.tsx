import Layout from 'components/layout';
import { PreviewGuildData } from 'models/preview_guilds';
import { userData } from 'models/users';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const [guilds, setGuilds] = useState<PreviewGuildData[]>([]);
  const [users, setUsers] = useState<userData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>();

  function request(q: string) {
    Promise.all([
      fetch(`${window.origin}/api/v1/kei/search_g?q=${q}`).then(async res => {
        const data = await res.json();
        if (data.code || data.message || !Array.isArray(data)) return;
        setGuilds(data);
      }),
      fetch(`${window.origin}/api/v1/kei/search_u?q=${q}`).then(async res => {
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

  return (
    <Layout>
      <div className='text-center'>
        <div style={{ marginTop: '47.5px' }}>
          <input
            placeholder='Search dmod.'
            className='px-3 py-2 w-2/3 rounded-l max-w-3xl focus:outline-none text-black'
            value={search ?? ''}
            onChange={({ currentTarget }) => setSearch(currentTarget.value)}
          />
          <button
            className='bg-purple-900 px-5 py-2 rounded-r'
            onClick={() => {
              if (search.length <= 0) return;
              setLoading(true);
              Get();
              router.push(`/search?q=${search}`);
            }}
          >
            Search.
          </button>
        </div>
      </div>
      {loading ? (
        <div className='loader loader4'>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <div>
                        <div>
                          <div>
                            <div />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='mx-0 sm:mx-4 mt-16 flex flex-col space-x-3 justify-center'>
          <h2 className='mb-1 ml-2'>Users</h2>

          {users.length <= 0 && (
            <div className='text-center w-full mt-4'>
              <span className='text-5xl font-bold'>Nothing found{' :('}</span>
            </div>
          )}

          <div className='w-full flex overflow-y-hidden'>
            {users.map(user => {
              return (
                <div key={user._id} className='bg-listingcard p-2 rounded cursor-pointer' style={{ maxWidth: '17.5rem' }} onClick={() => router.push(`/${user.vanity}`)}>
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

          <div className='w-full flex'>
            {guilds.map(guild => {
              return (
                <div key={guild._id} className='bg-listingcard p-2 rounded cursor-pointer' onClick={() => router.push(`/servers/${guild._id}`)}>
                  <h1 className='text-xl'>{guild.name}</h1>
                  <span>{guild.short_description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}
