import { section as Isection } from 'models/guilds';
import React, { useState } from 'react';

import ApplicationField from './applicationField';

export default function Section({
  section,
  id = '',
  name = '',
}: {
  section: Isection;
  id?: string;
  name?: string;
}) {
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description);

  return (
    <div id={id}>
      <div className='bg-listingcard md:ml-0 ml-2 pt-1 px-3 rounded'>
        <div>
          <div style={{ fontSize: '30px' }} className='flex justify-end'>
            <textarea
              name={name}
              id={id}
              rows={10}
              className='section_target_textarea leading-none resize-none focus:outline-none bg-listingcard'
              defaultValue={title}
              placeholder='Form title'
              onBlur={({ target }) => {
                if (target.value.length < 1) {
                  // eslint-disable-next-line no-param-reassign
                  target.value = section.title;
                  setTitle(section.title);
                }
              }}
              onChange={({ target }) => {
                setTitle(target.value);
              }}
            />
          </div>
        </div>
        <div style={{ borderTop: 'solid 2px rgb(103, 115, 133)', marginBottom: '4px' }} />
        <span>
          <textarea
            name={name}
            id={id}
            rows={10}
            placeholder='Form description'
            className='h-6 resize-none focus:outline-none bg-listingcard'
            defaultValue={description}
            onChange={({ target }) => {
              setDescription(target.value);
            }}
          />
        </span>
      </div>
      {/* section fields */}
      <div className='mt-3 space-y-2'>
        {section.fields
          .sort((a, b) => a.postition - b.postition)
          .map(field => (
            <ApplicationField key={field._id} field={field} id={field._id + section._id} />
          ))}
      </div>
    </div>
  );
}
