import AccessError from 'components/error/AccessError';
import Footer from 'components/footer';
import GuildPreviewCard from 'components/guildPreviewCard';
import MetaTags from 'components/MetaTags';
import { clsx } from 'lib/constants';
import { PreviewGuildData } from 'models/preview_guilds';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from 'styles/home.module.scss';

export default function Home() {
  const [list, setList] = useState<
    (PreviewGuildData & { banner?: string; icon?: string })[]
  >([]);
  const [search, setSearch] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetch(`${window.origin}/api/v1/kei/search_g?all=true`).then(async res => {
      setList(await res.json());
    });
  }, []);

  function searchRedirect() {
    search.length > 0 && router.push(`/search?q=${search}`);
  }

  return (
    <>
      <MetaTags />
      <main>
        <div className={styles.top}>
          <div>
            <h1>Welcome to dmod.</h1>
            {/* <p className='-mt-2'>Discords most advanced moderator searching application.</p> */}
          </div>
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
        <div className='mx-4 mt-2 flex flex-wrap space-y-2'>
          {list.map((guild, i) => {
            const time = () => {
              const t = 0.2 * i + 1;
              if (t > 6) return Number(`${i / 4}`);
              return t;
            };

            return (
              <GuildPreviewCard
                duration={time()}
                className='gdc-sihf'
                key={guild._id}
                guild={guild}
              />
            );
          })}
        </div>
        <Footer />
      </main>
      <AccessError />
      {/* TODO: allow rating to be updated, giveing correct data of people of 3.5 - 5 stars */}
      {/* <div className={home.home_main_content}>
        <div className={home.top_rated}>
          <div className={home.heading}>
            <h1>Top rated moderators.</h1>
            <p>Based on user feedback these people are the best!</p>
          </div>
        </div>
      </div> */}
    </>
  );
}
