import { FieldData } from 'models/guilds';
import { useState } from 'react';

export default function ApplicationField({ field, id }: { field: FieldData; id?: string }) {
  const [title, setTitle] = useState(field.title);
  const [description, setDescription] = useState(field.description);

  return (
    <div className='bg-listingcard md:ml-0 ml-2 pt-1 px-3 rounded'>
      <textarea
        // name={name}
        id={id}
        rows={10}
        className='section_target_textarea leading-none resize-none focus:outline-none bg-listingcard'
        defaultValue={title}
        placeholder='Field title'
        onBlur={({ target }) => {
          if (target.value.length < 1) {
            // eslint-disable-next-line no-param-reassign
            target.value = field.title;
            setTitle(field.title);
          }
        }}
        onChange={({ target }) => {
          setTitle(target.value);
        }}
      />
      <div style={{ borderTop: 'solid 2px rgb(103, 115, 133)', marginBottom: '4px' }} />
      <span>
        <textarea
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
  );
}
