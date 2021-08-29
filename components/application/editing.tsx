// import AFRH from 'lib/applicationFormRequestHelper';
import { section as Isection } from 'models/guilds';
import { useState } from 'react';

import Section from './section';

export default function Editing({ sections: __sections }: { sections: Isection[] }) {
  const [sections] = useState(__sections);
  // const [open, setOpen] = useState(isMobile);
  // const [saving, setSaving] = useState(false);

  // const formHelper = new AFRH(router.query.guildID as string);

  return (
    <>
      <div className='application-contaner'>
        <div className='section-contaner'>
          {sections.map(s => (
            <Section key={s._id} section={s} id={`section$$${s._id}`} />
          ))}
        </div>
      </div>

      <div>
        <div className='application_footer_ops_avx'>
          <div className='application_footer_content_ggd bg-footer px-2 py-1'>
            <div className='application_ops_solv'>
              <button>Add Field</button>
              <button disabled={sections.length > 0}>Add Section</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
