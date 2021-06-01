import react, { useState } from 'react';
import DatePicker from 'react-datepicker';
import styles from '../../styles/forms.module.scss';

interface props {
  onChange: (date: Date) => void;
  filled?: string;
  date: Date;
}

function Date_Picker(props: props) {
  let handleDateChange = d => {
    props.onChange(new Date(d));
  };

  return (
    <div className={`${styles.date_picker_container} ${props.filled == '' ? styles.unfilled_text : ''}`}>
      <span>
        <img src={'/birthday.png'} className={styles.icon}></img>
        <span className={styles.text_container}>Date of brith (DD/MM/YYYY)</span>
      </span>
      <div className={styles.picker_container}>
        <DatePicker selected={props.date} placeholder={'DD/MM/yyyy'} onChange={handleDateChange} showMonthYearDatePicker dateFormat="dd/MM/yyyy" />
      </div>
    </div>
  );
}

export default Date_Picker;
