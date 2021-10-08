import type { FormikHandlers } from 'formik';
import { useEffect, useState } from 'react';

interface EditorProps {
  value: string;
  handleBlur: FormikHandlers['handleBlur'];
  handleChange: FormikHandlers['handleChange'];
  max: number;
  min: number;
  id?: string;
}

export default function Editor({ value, handleBlur, handleChange, max, min, id }: EditorProps) {
  const [textTooSmall, setTooSmall] = useState(value.length < min);
  const [textTooBig, setTooBig] = useState(value.length > max);

  useEffect(() => {
    setTooBig(value.length > max);
    setTooSmall(value.length < min);
  }, [value]);

  return (
    <>
      <div className='container_mini'>
        <textarea
          className='editor_mini'
          id={id ?? 'description'}
          cols={40}
          rows={10}
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          spellCheck
        />
        <span className='range_content'>
          <span className='range_count'>{value.length}</span>/<span className='range_max'>{max}</span>
        </span>
      </div>
      {/* Temp */}
      <style>{`
      .editor_mini {
        outline: none;
        resize: none;
        color: grey;
        background-color: #061021;
        border: 1px solid #030811;
        border-radius: 4px;
        padding: 6px;
        font-size: 1rem;
      }
      .container_mini {
        position: relative;
      }
      .range_content {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: ${textTooBig ? 'red' : ''};
        transition: all 0.3s
      }
      .range_count {
        color: ${textTooSmall ? 'red' : ''};
        transition: all 0.3s
      }
    `}</style>
    </>
  );
}
