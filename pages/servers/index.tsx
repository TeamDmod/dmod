import AnimatedLoader from 'components/AnimatedLoader';
import CreateGuildApplicationModal from 'components/guild/CreateGuildApplicationModal';
// import GuildCard from 'components/GuildCard';
import MetaTags from 'components/MetaTags';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from 'styles/preview.module.scss';
import { RawUserGivenGuild, RawUserGuildIs } from 'typings/typings';

interface ApiUserGuildData {
  included: RawUserGuildIs[];
  excluded: RawUserGivenGuild[];
}

export default function Server({ user }: any) {
  const [loading, setLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [IsModalOpen, setModalOpen] = useState(false);
  const [selectedGuildModalData, setGuildModleData] = useState(null);

  const [userGuildData, setData] = useState<ApiUserGuildData>({} as ApiUserGuildData);

  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
    if (user && !user.awaiting) {
      console.log('we bee featching');
      fetch(`${window.origin}/api/discord/guilds`)
        .then(_ => _.json())
        .then(data => {
          if (!data.success) setIsError(true);
          setData(data.data);
          setLoading(false);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <main>
        <MetaTags title='dmod.gg - Servers Loading' />
        <AnimatedLoader />
      </main>
    );
  }

  if (IsError) {
    return (
      <main>
        <MetaTags title='dmod.gg - Servers ERROR' />
        <h3 className='error'>An error has occored! Try again in a bit... 😔</h3>
      </main>
    );
  }

  return (
    <main>
      <MetaTags title='dmod.gg - Servers' description='dmod.gg servers list' />
      {userGuildData.included.length > 0 && (
        <>
          <h1 className={styles.heading}>Your Servers</h1>
          <div className={styles.card_container}>
            {userGuildData.included.map(guild => (
              <div key={guild.id} className={styles.card} onClick={() => router.push(`/servers/${guild.id}`)}>
                <img
                  draggable={false}
                  className={styles.icon}
                  src={
                    guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
                      : `/logo.png`
                  }
                  alt='guild icon'
                />
                <p className='truncate'>{guild.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <h1 className={styles.heading}>Add Servers</h1>
      <div className={styles.card_container}>
        {userGuildData.excluded.map(guild => (
          <div
            key={guild.id}
            className={styles.card}
            onClick={() => {
              setGuildModleData(guild);
              setModalOpen(true);
            }}>
            <img
              draggable={false}
              className={styles.icon}
              src={
                guild.icon
                  ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
                  : `/logo.png`
              }
              alt='guild icon'
            />
            <p className='truncate'>{guild.name}</p>
          </div>
        ))}
      </div>
      <CreateGuildApplicationModal
        guild={selectedGuildModalData}
        closeModal={() => setModalOpen(false)}
        isOpen={IsModalOpen}
      />
    </main>
  );
}
