import react, {useState} from 'react';
import DatePicker from "react-datepicker";


function Date_Picker() {
    const [date, setDate] = useState(new Date());

    let handleDateChange = (d) => {
        setDate(d);
    }

    return (
        <div>
            <DatePicker
                selected={date}
                onChange={handleDateChange}
                showMonthYearDatePicker
                dateFormat="dd/MM/yyyy"
            />
        </div>
    )
}


export default Date_Picker;