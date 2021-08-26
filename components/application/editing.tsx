import { clsx } from 'lib/constants';
import { section as Isection } from 'models/guilds';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import Section from './section';

export default function Editing({ sections }: { sections: Isection[] }) {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [open, setOpen] = useState(isMobile);

  return (
    <div className='application-contaner relative'>
      <div
        className={clsx(
          'application-tree transition-all duration-200',
          'md:sticky absolute top-0',
          `-left-${open ? '0' : '36'}`,
          !open ? 'md:cursor-default cursor-pointer' : ''
        )}
        onClick={() => {
          if (isMobile && !open) setOpen(!open);
        }}>
        <div className='md:hidden flex justify-end'>
          <svg
            className='cursor-pointer'
            onClick={() => setOpen(!open)}
            width='30'
            height='30'
            viewBox='0 0 40 41'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M24.2559 4.97993C24.3561 4.91536 24.4649 5.04853 24.3817 5.1338L9.54822 20.3397L24.4059 34.9171C24.4903 34.9999 24.3864 35.1349 24.2847 35.0744L1.08413e-05 20.6254L24.2559 4.97993Z'
              fill='#FBFBFB'
            />
          </svg>
        </div>
        {sections.map(section => {
          return (
            <div key={section._id}>
              {section.title}
              <div className='fields-list'>
                {section.fields.map(field => {
                  return <div key={field.section_id + field._id}>- {field.title}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className='section-contaner'>
        {sections.map(s => (
          <Section key={s._id} section={s} />
        ))}
      </div>
    </div>
  );
}
