import LinkChecker from 'components/guild/LinkChecker';
import { bannerResolver, clsx, evalBadges, evalFlags } from 'lib/constants';
import MarkDown from 'lib/markdown';
import { userData } from 'models/users';
import React, { useEffect } from 'react';

interface props {
  profile: userData;
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);

  const bannerData = bannerResolver(profile.banner);

  useEffect(() => {
    const lig = [];

    document.querySelectorAll('a[role="button"][data-to]').forEach(elm => {
      const nvm = () => {
        // @ts-expect-error
        LinkChecker.create(elm?.dataset.to);
      };
      lig.push({ elm, nvm });
      elm.addEventListener('click', nvm);
    });

    return () => {
      LinkChecker.destroy();
      lig.forEach(({ elm, nvm }) => {
        elm.removeEventListener('click', nvm);
      });
    };
    // window.addEventListener('scroll', toggleVisible);
  }, [profile.description]);

  return (
    <div>
      <div className='h-80 md:h-60 overflow-x-hidden'>
        {bannerData.type === 'img' && (
          <div
            className='h-full w-full rounded-b max-h-screen bg-no-repeat'
            style={{
              backgroundImage: `url(${bannerData.image})`,
              backgroundSize: '100% ',
              minWidth: '600px',
              backgroundPosition: 'center center',
            }}
          />
        )}
        {bannerData.type === 'color' && (
          <div
            style={{
              backgroundColor: bannerData.color,
            }}
            className='h-full w-full rounded-b'
          />
        )}
        {bannerData.type === 'unknown' && (
          <div className='bg-red-600 h-full w-full rounded-b flex flex-wrap content-center'>
            <h1 className='text-center w-full text-xl animate-floting'>ERROR! Unknow banner type!</h1>
          </div>
        )}
      </div>
      <div className='flex flex-wrap md:flex-row flex-col -my-14 content-center ml-0 md:ml-9 md:space-x-3 space-y-3 lg:space-y-0'>
        <div className='md:w-max w-full flex flex-wrap justify-center'>
          <img
            className={clsx('rounded-full h-32 w-32 select-none border-3', profile.active ? 'border-green-600' : 'border-gray-500')}
            draggable={false}
            src={profile.avatarURL}
            alt='User avatar'
            onError={({ currentTarget }) => {
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${+profile.discriminator % 5}.png`;
            }}
          />
        </div>

        <div className='flex flex-wrap md:flex-row flex-col md:space-x-3 space-y-3 lg:space-y-0 md:mt-52 mt-0'>
          <span className='flex flex-wrap sm:content-center justify-center text-xl'>
            <span>{profile.tag}</span>
          </span>

          <div className='badges-container-shdf flex flex-wrap content-center justify-center space-x-2 my-0 md:mb-3'>
            {/* Reverse as on pass in of the profile data the order is reversed */}
            {badges.reverse().map(
              ([badge, displayName], i) =>
                badge !== null && (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={`badges${i}`} className='badges-oujrf relative'>
                    <span className='badge-name-fis absolute text-white w-max text-center bg-gray-400 rounded-md bg-opacity-60 px-3'>{displayName}</span>
                    {badge}
                  </span>
                )
            )}
          </div>
        </div>
      </div>{' '}
      <div className='mt-16 mx-3'>
        {/* eslint-disable-next-line react/no-danger */}
        <div className='markdown-content-contaner' dangerouslySetInnerHTML={{ __html: new MarkDown(profile.description).render() }} />
      </div>
    </div>
  );
}
