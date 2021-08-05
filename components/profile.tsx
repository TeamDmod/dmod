import { bannerResolver, clsx, evalBadges, evalFlags } from 'lib/constants';
import MarkDown from 'lib/markdown';
import { userData } from 'models/users';
import React from 'react';

interface props {
  profile: userData;
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);

  const bannerData = bannerResolver(profile.banner);

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
            <h1 className='text-center w-full text-xl animate-floting'>
              ERROR! Unknow banner type!
            </h1>
          </div>
        )}
      </div>
      <div className='flex flex-wrap md:flex-row flex-col -my-14 content-center ml-0 md:ml-9 md:space-x-3 space-y-3 lg:space-y-0'>
        <img
          className={clsx(
            'ml-3 sm:ml-0 rounded-full h-32 w-32 select-none border-3',
            profile.active ? 'border-green-600' : 'border-gray-500'
          )}
          draggable={false}
          src={profile.avatarURL}
          alt='User avatar'
          onError={({ currentTarget }) => {
            // eslint-disable-next-line no-param-reassign
            currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${
              +profile.discriminator % 5
            }.png`;
          }}
        />
        <span className='flex flex-wrap content-center text-xl'>
          <span>{profile.tag}</span>
        </span>

        <div className='flex flex-wrap content-center justify-center space-x-2 sm:space-x-4 my-0 md:mt-1 md:mb-3'>
          {/* Reverse as on pass in of the profile data the order is reversed */}
          {badges.reverse().map(
            ([badge, displayName], i) =>
              badge !== null && (
                // eslint-disable-next-line react/no-array-index-key
                <span title={displayName} key={`badges${i}`}>
                  {badge}
                </span>
              )
          )}
        </div>
      </div>{' '}
      <div className='mt-16 mx-3 bio'>
        {/* eslint-disable-next-line react/no-danger */}
        <div
          dangerouslySetInnerHTML={{
            __html: new MarkDown(profile.description).render(),
          }}
        />
      </div>
    </div>
  );
}
