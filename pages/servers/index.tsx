import AnimatedLoader from 'components/AnimatedLoader';
import CreateGuildApplicationModal from 'components/CreateGuildApplicationModal';
// import GuildCard from 'components/GuildCard';
import Layout from 'components/layout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RawUserGuildIs, RawUserGivenGuild } from 'typings/typings';

interface ApiUserGuildData {
  included: RawUserGuildIs[];
  excluded: RawUserGivenGuild[];
}

export default function Server({ user }) {
  const [loading, setLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [IsModalOpen, setModalOpen] = useState(false);
  const [selectedGuildModalData, setGuildModleData] = useState(null);
  const [ModalErrorData, setModalErrorData] = useState<[boolean, string | null]>([false, null]);

  const [userGuildData, setData] = useState<ApiUserGuildData>({} as ApiUserGuildData);

  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
    if (user && !user['awaiting']) {
      fetch(`${window.origin}/api/discord/guilds`)
        .then(_ => _.json())
        .then(data => {
          if (!data.success) setIsError(true);
          setData(data.data);
          setLoading(false);
        })
        .catch(_ => {
          setIsError(true);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <Layout title='• Servers'>
        <AnimatedLoader />
      </Layout>
    );
  }

  if (IsError) {
    return (
      <Layout title='• Servers'>
        <div className='text-center text-xl'>
          <h1 className='text-red-600'>An error has occored! Try again in a bit.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Servers'>
      <div className='space-y-6 w-screen'>
        {userGuildData.included.length > 0 && (
          <div className='space-y-3 text-xl'>
            <h1 className='text-center'>Guilds Applications found.</h1>
            <div className='flex justify-center overflow-x-hidden'>
              <div className='flex flex-col sm:grid grid-cols-3 gap-3 w-full sm:w-2/3'>
                {userGuildData.included.map(guild => (
                  <div key={guild.id} className='flex rounded-md bg-servercard py-2 px-4 cursor-pointer space-x-2 max-w-2xl' onClick={() => router.push(`/servers/${guild.id}`)}>
                    <img
                      draggable={false}
                      className='rounded-full w-14 h-14 md:w-20 md:h-20'
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                      alt='guild icon'
                    />
                    <span className='inline-flex flex-wrap content-center text-xl md:text-2xl overflow-x-hidden'>{guild.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className='space-y-3 text-xl'>
          <h1 className='text-center'>Guilds Applications found.</h1>
          <div className='flex justify-center overflow-x-hidden'>
            <div className='flex flex-col sm:grid grid-cols-3 gap-3 w-full sm:w-2/3'>
              {userGuildData.excluded.map(guild => (
                <div
                  key={guild.id}
                  className='flex rounded-md bg-servercard py-2 px-4 cursor-pointer space-x-2 max-w-2xl'
                  onClick={() => {
                    setGuildModleData(guild);
                    setModalOpen(true);
                  }}
                >
                  <img
                    draggable={false}
                    className='rounded-full w-14 h-14 md:w-20 md:h-20'
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                    alt='guild icon'
                  />
                  <span className='inline-flex flex-wrap content-center text-xl md:text-2xl overflow-x-hidden'>{guild.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CreateGuildApplicationModal guild={selectedGuildModalData} closeModal={() => setModalOpen(false)} isOpen={IsModalOpen} errorState={[ModalErrorData, setModalErrorData]} />
    </Layout>
  );
}
