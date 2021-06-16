import React, { useRef, useState } from 'react';

import forms from '../../styles/forms.module.scss';

interface props {
  inital?: string;
  onChange: (text: string) => void;
  name: string;
  items: any[];
  image: string;
  filled?: boolean;
}

function Selector({ inital, image, onChange, items, name, filled }: props) {
  const initial = inital || 'Please select one';
  const dropdownRef = useRef<HTMLDivElement>();
  const [currentlySelected, setSelected] = useState(initial);
  const [isDown, setDown] = useState(false);

  const onclick = () => {
    setDown(!isDown);

    if (isDown) {
      dropdownRef.current.className = `${forms.dropdown} ${forms.selected}`;
    } else {
      dropdownRef.current.className = `${forms.dropdown} ${forms.normal}`;
    }
  };

  const selectItem = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    setSelected(e.currentTarget.textContent);
    if (onChange) onChange(e.currentTarget.textContent);
  };

  return (
    <div className={`${forms.selector_container} ${filled === false ? forms.unfilled_text : ''}`}>
      <span>
        <img src={image} alt='U' />
        <span className={forms.text_contianer_text}>{name}</span>
      </span>
      <div onClick={onclick} ref={dropdownRef} className={forms.dropdown}>
        <span className={forms.currently_selected}>
          {currentlySelected}
          <span className={forms.down_arrow}>
            <img src='./down-arrow.png' alt='' />
          </span>
        </span>
        <div className={forms.dropdown_selector}>
          {items.map(item => {
            return (
              <p key={item} onClick={e => selectItem(e)} className={forms.item}>
                {item}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Selector;
