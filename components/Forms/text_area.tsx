import React from 'react';
import forms from 'styles/forms.module.scss';

function TextArea({ image, error, name, placeholder, register }: any) {
  return (
    <div className={`${forms.text_container} ${error ? forms.error : null}`}>
      <span>
        <img src={image} alt='t' />
        <span className={forms.text_contianer_text}>{name}</span>
      </span>
      <textarea className={forms.embedded_form} placeholder={placeholder} {...register} />
    </div>
  );
}

export default TextArea;
