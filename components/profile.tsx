import { evalBadges, evalFlags } from 'lib/constants';
import { userData } from 'models/users';
import React from 'react';

interface props {
  profile: userData;
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);

  return (
    <div>
      <div className='h-80 md:h-60 overflow-x-hidden'>
        {profile.banner && (
          <div
            className='h-full w-full rounded-b max-h-screen bg-no-repeat'
            style={{
              backgroundImage: `url(${profile.banner})`,
              backgroundSize: '100% ',
              minWidth: '600px',
              backgroundPosition: 'center center',
            }}
          />
        )}
        {!profile.banner && <div className='bg-purple-900 h-full w-full rounded-b' />}
      </div>
      <div className='flex flex-wrap md:flex-row flex-col -my-14 content-center ml-0 md:ml-9 md:space-x-3 space-y-3 lg:space-y-0'>
        <img
          className='ml-3 sm:ml-0 rounded-full h-32 w-32 select-none'
          draggable={false}
          src={profile.avatarURL}
          alt='User avatar'
          onError={({ currentTarget }) => (currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${+profile.discriminator % 5}.png`)}
        />
        <span className='flex flex-wrap content-center text-xl'>
          <span>{profile.tag}</span>
        </span>

        <div className='flex flex-wrap content-center justify-center space-x-2 sm:space-x-4 my-0 md:mt-1 md:mb-3'>
          {/* Reverse as on pass in of the profile data the order is reversed */}
          {badges.reverse().map(
            ([badge, displayName], i) =>
              badge !== null && (
                <span title={displayName} key={'badges' + i}>
                  {badge}
                </span>
              )
          )}
        </div>
      </div>{' '}
      <div className='mt-16'>
        <div>{profile.description}</div>
      </div>
    </div>
  );
}
