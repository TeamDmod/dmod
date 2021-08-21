import 'tailwindcss/tailwind.css';

import { clsx } from 'lib/constants';
import MarkDown from 'lib/markdown';
import useAtagWatch from 'lib/useAtagWatch';
import { GuildData } from 'models/guilds';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { RawGuild } from 'typings/typings';

import GuildStatus from './guildStatus';

interface props {
  guild: RawGuild & GuildData & { guild_description: string };
  isManager: boolean;
  Inpreview: boolean;
  hasApp: boolean;
  len: number;
}

const appSatus = [
  'Applications Closed',
  'Applications Open',
  'Applications Full',
  'Applications opining {time}',
  'Applications open with {slots}',
];
const appColorStaus = [
  'rgb(191, 42, 29)',
  'rgb(20, 184, 110)',
  'rgb(76, 29, 149)',
  'rgb(14, 53, 194)',
  'rgb(196, 12, 55)',
];

function DropDownIcon() {
  return (
    <path
      d='M29.491524206117255 -5.5 L37.491524206117255 -5.5 L37.491524206117255 5.5 L29.491524206117255 5.5 A30 30 0 0 1 26.12715009048092 14.743541913308446 L26.12715009048092 14.743541913308446 L32.25550563543275 19.885842790800762 L25.18484192888081 28.312331665109514 L19.056486383928988 23.1700307876172 A30 30 0 0 1 10.537592076579571 28.08841670916336 L10.537592076579571 28.08841670916336 L11.926777497915015 35.96687873326103 L1.0938922147807286 37.87700868759726 L-0.2952932065547146 29.998546663499596 A30 30 0 0 1 -9.98262238224421 28.290409158821245 L-9.98262238224421 28.290409158821245 L-13.98262238224421 35.218612389096755 L-23.50890182387304 29.71861238909675 L-19.50890182387304 22.79040915882124 A30 30 0 0 1 -25.831856883926196 15.255004750191159 L-25.831856883926196 15.255004750191159 L-33.349397850213464 17.99116589679651 L-37.111619426795826 7.654547068151507 L-29.59407846050856 4.918385921546156 A30 30 0 0 1 -29.59407846050856 -4.9183859215461485 L-29.59407846050856 -4.9183859215461485 L-37.111619426795826 -7.654547068151498 L-33.349397850213464 -17.991165896796502 L-25.8318568839262 -15.255004750191151 A30 30 0 0 1 -19.508901823873053 -22.79040915882123 L-19.508901823873053 -22.79040915882123 L-23.508901823873057 -29.718612389096737 L-13.982622382244227 -35.21861238909675 L-9.982622382244223 -28.29040915882124 A30 30 0 0 1 -0.29529320655473523 -29.998546663499596 L-0.29529320655473523 -29.998546663499596 L1.0938922147807042 -37.87700868759726 L11.926777497915003 -35.96687873326103 L10.537592076579564 -28.08841670916336 A30 30 0 0 1 19.056486383928977 -23.170030787617215 L19.056486383928977 -23.170030787617215 L25.1848419288808 -28.312331665109532 L32.25550563543274 -19.885842790800766 L26.127150090480917 -14.743541913308448 A30 30 0 0 1 29.491524206117255 -5.500000000000013 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20'
      fill='#474747'
    />
  );
}

export default function GuildView({ guild, isManager, Inpreview, hasApp, len }: props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  // const [visible, setVisible] = useState(false);

  // function toggleVisible() {
  //   const scrolled = document.documentElement.scrollTop;
  //   if (scrolled > 300) {
  //     setVisible(true);
  //   } else if (scrolled <= 300) {
  //     setVisible(false);
  //   }
  // }

  // function scrollToTop() {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //     /* you can also use 'auto' behaviour
  //        in place of 'smooth' */
  //   });
  // }

  useAtagWatch(guild.description);

  function resolveType(str: string): string {
    if (str.startsWith('a_')) return `${str}.gif`;
    return `${str}.png`;
  }

  return (
    <>
      <div className='top-section relative overflow-x-hidden'>
        <div
          className='guild-banner w-full h-52 bg-no-repeat'
          style={{
            backgroundImage: guild.banner
              ? `url(https://cdn.discordapp.com/banners/${guild.id}/${resolveType(guild.banner)})`
              : 'url(https://cdn.discordapp.com/banners/791278367960858635/c149d4fa025bcfdd89c38b9fdfc34724.png?size=4096)',
            backgroundSize: '100%',
            minWidth: '600px',
            backgroundPosition: 'center center',
          }}
        />
        <div className='icon-contaner flex justify-center'>
          <div
            className='guild-icon w-32 h-32 rounded-full absolute top-7'
            style={{
              boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.25)',
              backgroundImage: guild.icon
                ? `url(https://cdn.discordapp.com/icons/${guild.id}/${resolveType(guild.icon)})`
                : 'url(https://cdn.discordapp.com/attachments/809558712397070387/858194738465603594/unknown.png)',
              backgroundSize: '100%',
              backgroundPosition: 'center center',
            }}
          />
          <div
            // TODO: fix animation to zoom in and out instead, and go around the server icon
            className={clsx(
              'flex justify-center transition duration-150 ease-in-out absolute top-7 w-32 h-32 rounded-full opacity-0',
              isManager ? 'hover:opacity-80 cursor-pointer' : ''
            )}
            style={{ zIndex: 60 }}
            onClick={() => {
              if (isManager && !Inpreview) router.push(`/servers/${guild.id}/settings`);
            }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              style={{
                margin: 'auto',
                display: 'block',
                shapeRendering: 'auto',
              }}
              width='110px'
              height='130px'
              viewBox='0 0 100 100'
              preserveAspectRatio='xMidYMid'>
              <g transform='translate(50 50) scale(1.5)'>
                <g>
                  <animateTransform
                    attributeName='transform'
                    type='rotate'
                    values='0;40'
                    keyTimes='0;1'
                    dur='0.3076923076923077s'
                    repeatCount='indefinite'
                  />
                  <DropDownIcon />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className='static md:hidden'>
        <div
          className='m-3 p-2 rounded'
          style={{
            background: '#1A274D',
            boxShadow: '-7px 0px 8px rgba(0, 0, 0, 0.25)',
          }}>
          {open ? (
            <div>
              <div onClick={() => setOpen(!open)} className='py-1 px-2 rounded bg-indigo-600 cursor-pointer'>
                Close
              </div>
              <GuildStatus guild={guild} />
            </div>
          ) : (
            <div className='flex justify-center cursor-pointer' onClick={() => setOpen(!open)}>
              <svg width='36' height='39' viewBox='0 0 36 39' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M17.6569 38.1041L0.0152298 20.4624L2.21662 18.2305L17.6569 32.9064L33.036 18.2305L35.2985 20.4624L17.6569 38.1041Z'
                  fill='#C8D2DC'
                />
                <path
                  d='M17.6569 29.2985L0.0152298 11.6569L2.21662 9.42497L17.6569 24.1009L33.036 9.42497L35.2985 11.6569L17.6569 29.2985Z'
                  fill='#C8D2DC'
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className='flex'>
        <div className='w-full'>
          <div>
            <div
              className='markdown-content-contaner m-3 text-lg'
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: new MarkDown(guild.description).render() }}
            />
          </div>
        </div>
        <div className='hidden md:block w-3/12'>
          <div className={clsx('sticky top-1 space-y-2')}>
            <GuildStatus guild={guild} shadow />
            <div>
              <div
                title='Currently Under Development'
                className={clsx('rounded px-2 py-1', hasApp ? '' : 'cursor-pointer')}
                style={{ backgroundColor: appColorStaus[guild.application_status] }}
                onClick={() => {
                  if (hasApp) return;
                  router.push(`/servers/${guild.id}/apply`);
                }}>
                {appSatus[guild.application_status]
                  .replace('{time}', new Date(guild.application_status_data?.date).toDateString())
                  .replace(
                    '{slots}',
                    guild.application_status_data ? `${len}/${guild.application_status_data.max}` : 'Unknown'
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: make a back to top button */}
    </>
  );
}
