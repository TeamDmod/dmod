import { section as Isection } from 'models/guilds';
import React, { useState } from 'react';

export default function Section({ section }: { section: Isection }) {
  const [title, setTitle] = useState(section.title);
  // section.description
  const [description, setDescription] = useState(section.description);

  return (
    <div className='bg-gray-600 md:w-2/5 md:ml-0 ml-2 pt-1 px-3 rounded-t'>
      <div>
        <div style={{ fontSize: '30px' }} className='flex justify-end'>
          <textarea
            name=''
            id=''
            rows={10}
            className='h-9 leading-none resize-none focus:outline-none bg-gray-600'
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
          name=''
          id=''
          rows={10}
          placeholder='Form description'
          className='h-6 resize-none focus:outline-none bg-gray-600'
          defaultValue={description}
          onChange={({ target }) => {
            setDescription(target.value);
          }}
        />
      </span>
    </div>
  );
}
