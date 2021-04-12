import React from 'react';
import forms from '../../styles/forms.module.scss';

function TextArea(props) {

    let onChange = (d) => {
        if (props.onChange) {
            props.onChange(d.target.value);
        }
    };


    return (
        <div className={`${forms.text_container} ${props.filled == "" ? forms.unfilled_text : ""}`}>
            <span><img src={props.image}></img><span className={forms.text_contianer_text}>{props.name}</span></span>
            <textarea onChange={onChange} className={forms.embedded_form} placeholder={props.placeholder} />
        </div>
    )
}


export default TextArea;