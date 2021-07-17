import { clsx, PREMIUM_TIER, VERIFICATION_LEVEL } from 'lib/constants';
import { GuildData } from 'models/guilds';
import router from 'next/router';
import React from 'react';
import { RawGuild } from 'typings/typings';

interface props {
  guild: RawGuild & GuildData & { guild_description: string };
  sticky?: boolean;
}
export default function GuildStatus({ guild, sticky }: props) {
  function toLinkTags(tags: string[]) {
    const children: React.ReactNode[] = [];

    tags.forEach(tag => {
      const tagElm = (
        <span key={tag} className='hover:text-indigo-100 text-white cursor-pointer' title={tag} onClick={() => router.push(`/search?tags=${tag}`)}>
          {tag}
        </span>
      );
      children.push(tagElm);
    });
    const Tags = React.createElement(React.Fragment, {}, children);

    return Tags;
  }

  function ProperWithAnd(looking: string[]): string {
    const caps = looking.map(look => {
      const _ = look.toLowerCase();
      return `${_[0].toUpperCase()}${_.slice(1)}`;
    });
    if (caps.length === 1) return `${caps[0]}s`;
    if (caps.length === 2)
      return caps.reduce((past, cerr, cerrIndex) => {
        // eslint-disable-next-line no-param-reassign
        return (past += `${cerr}s`.slice(cerrIndex === 0 ? 2 : 0));
      }, '');

    return caps.reduce((past, cerr, cerrIndex) => {
      // eslint-disable-next-line no-param-reassign
      return cerrIndex !== caps.length - 1 ? (past += `, ${cerr}s`.slice(cerrIndex === 0 ? 2 : 0)) : (past += `, and ${cerr}s`);
    }, '');
  }

  return (
    <div
      className={clsx(sticky ? 'sticky' : '', 'top-1 p-3 mt-3 mr-2 rounded space-y-3')}
      style={{
        background: '#1A274D',
        boxShadow: sticky ? '-7px 0px 8px rgba(0, 0, 0, 0.25)' : '',
      }}
    >
      <span className='block text-center underline text-xl font-bold'>{guild.name}</span>
      <div style={{ lineHeight: '23.5px' }}>
        <span title='Short description'>
          <b>Short description</b>: {guild.short_description}
        </span>
        <br />
        <span title='Approximate member count'>
          <b>Member count</b>: {guild.approximate_member_count}
        </span>
        <br />
        <span title='Server region'>
          <b>Region</b>: {guild.region}
        </span>
        <br />
        <span title='Server tags'>
          {/* <b>Tags</b>: <span className='space-x-1'>{toLinkTags(['roblox', 'gaming'])}</span> */}
          <b>Tags</b>: <span className='space-x-1'>{guild.tags.length > 0 ? toLinkTags(guild.tags) : 'None'}</span>
        </span>
        <br />
        <span title='Server looking for'>
          <b>Looking for</b>: {ProperWithAnd(guild.look_types)}
        </span>
        <br />
        <span title='Server premium tier'>
          <b>Premium Tier</b>: {PREMIUM_TIER[guild.premium_tier]}
        </span>
        <br />
        <span title='Server verifction level'>
          <b>Verfiction Level</b>: {VERIFICATION_LEVEL[guild.verification_level]}
        </span>
        <br />
        {guild.emojis.length > 0 && (
          <>
            <span>
              <b>Emojis</b>:{' '}
              <span className='flex space-x-1'>
                {guild.emojis.map(emoji => {
                  return (
                    <img
                      style={{
                        maxHeight: '40px',
                        maxWidth: '40px',
                        minHeight: '20px',
                        minWidth: '20px',
                      }}
                      title={emoji.name}
                      src={`https://cdn.discordapp.com/emojis/${emoji.id}${emoji.animated ? '.gif' : '.png'}`}
                      key={emoji.id}
                      alt={emoji.name}
                    />
                  );
                })}
              </span>
            </span>
            <br />
          </>
        )}
      </div>
      <div>
        {guild.invite ? (
          <a href={guild.vanity_url_code ? `https://discord.com/invite/${guild.vanity_url_code}` : `https://discord.com/invite/${guild.invite}`} target='__blank'>
            <div className='bg-indigo-600 text-center px-0.5 py-2 rounded'>Join Server</div>
          </a>
        ) : (
          <div className='bg-red-500 text-center px-0.5 py-2 rounded'>No Server Invite</div>
        )}
      </div>
    </div>
  );
}
