import AccessError from 'components/error/AccessError';
import Footer from 'components/footer';
import GuildPreviewCard from 'components/guildPreviewCard';
import Layout from 'components/layout';
import { clsx } from 'lib/constants';
import { PreviewGuildData } from 'models/preview_guilds';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [list, setList] = useState<(PreviewGuildData & { banner?: string; icon?: string })[]>([]);
  const [search, setSearch] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetch(`${window.origin}/api/v1/kei/search_g?all=true`).then(async res => {
      setList(await res.json());
    });
  }, []);

  return (
    <Layout title='Welcome to Dmod.gg' description='The best place to hire moderators!' image='/logo.png'>
      <div style={{ minHeight: '82.8vh' }}>
        <div className={clsx('m-0 w-full text-center h-80 border-t-2 border-b-2')} style={{ backgroundColor: '#080e1f', borderColor: '#24114c' }}>
          <div>
            <h1 className='text-6xl sm:text-7xl font-bold pt-20'>Welcome to dmod.</h1>
            {/* <p className='-mt-2'>Discords most advanced moderator searching application.</p> */}
          </div>
          <div className='mt-5'>
            <input
              placeholder='Search dmod.'
              className='px-3 py-2 w-2/3 rounded-l max-w-3xl focus:outline-none text-black'
              value={search}
              onChange={({ currentTarget }) => setSearch(currentTarget.value)}
            />
            <button className='bg-purple-900 px-5 py-2 rounded-r' onClick={() => search.length > 0 && router.push(`/search?q=${search}`)}>
              Search.
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

            return <GuildPreviewCard duration={time()} className='gdc-sihf' key={guild._id} guild={guild} />;
          })}
        </div>
      </div>
      <Footer />
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
    </Layout>
  );
}
