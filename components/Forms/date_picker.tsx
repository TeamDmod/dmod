import react, { useState } from 'react';
import DatePicker from 'react-datepicker';
import styles from '../../styles/forms.module.scss';

interface props {
  onChange: Function;
  filled?: string
}

function Date_Picker(props: props) {
  const [date, setDate] = useState(new Date());

  let handleDateChange = d => {
    setDate(d);
    props.onChange(d);
  };

  return (
    <div className={`${styles.date_picker_container} ${props.filled == '' ? styles.unfilled_text : ''}`}>
      <span>
        <img src={'/birthday.png'} className={styles.icon}></img>
        <span className={styles.text_container}>Date of brith (DD/MM/YYYY)</span>
      </span>
      <div className={styles.picker_container}>
        <DatePicker selected={date} placeholder={'DD/MM/yyyy'} onChange={handleDateChange} showMonthYearDatePicker dateFormat="dd/MM/yyyy" />
      </div>
    </div>
  );
}

export default Date_Picker;
