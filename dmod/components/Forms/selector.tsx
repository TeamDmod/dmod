import React, { useRef, useState } from 'react';
import forms from '../../styles/forms.module.scss';

function Selector(props) {

    const dropdownRef = useRef();
    let [isDown, setDown] = useState(false);

    let onclick = () => {
        setDown(!isDown);

        if (isDown) {
            dropdownRef.current.className = `${forms.dropdown} ${forms.selected}`
        } else {
            dropdownRef.current.className = `${forms.dropdown}`
        }

    }

    return (
        <div className={forms.selector_container}>
            <span><img src={props.image}></img><span className={forms.text_contianer_text}>{props.name}</span></span>
            <div onClick={onclick} ref={dropdownRef} className={forms.dropdown}>
                <span className={forms.currently_selected}>Please select one <span className={forms.down_arrow}><img src={"./down-arrow.png"} alt="" /></span></span>
                <div className={forms.dropdown_selector}>
                    {props.items.map(item => {
                        return <p className={forms.item}>{item}</p>
                    })}
                </div>
            </div>
        </div >
    )
}

export default Selector;