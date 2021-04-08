import React, { useRef, useState } from 'react';
import forms from '../../styles/forms.module.scss';

function Selector(props) {
    const initial = props.inital || "Please select one";
    const dropdownRef = useRef(initial);
    const [currentlySelected, setSelected] = useState("Please Select one");
    let [isDown, setDown] = useState(false);

    let onclick = () => {
        setDown(!isDown);

        if (isDown) {
            dropdownRef.current.className = `${forms.dropdown} ${forms.selected}`
        } else {
            dropdownRef.current.className = `${forms.dropdown} ${forms.normal}`
        }
    }

    let selectItem = (e) => {
        setSelected(e.target.attributes.content.textContent)
        if (props.onChange) {
            props.onChange(currentlySelected)
        }
    }

    return (
        <div className={forms.selector_container}>
            <span><img src={props.image}></img><span className={forms.text_contianer_text}>{props.name}</span></span>
            <div onClick={onclick} ref={dropdownRef} className={forms.dropdown}>
                <span className={forms.currently_selected}>{currentlySelected}<span className={forms.down_arrow}><img src={"./down-arrow.png"} alt="" /></span></span>
                <div className={forms.dropdown_selector}>
                    {props.items.map(item => {
                        return <p content={item} key={item} onClick={selectItem} className={forms.item}>{item}</p>
                    })}
                </div>
            </div>
        </div >
    )
}

export default Selector;