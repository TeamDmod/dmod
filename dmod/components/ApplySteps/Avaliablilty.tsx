import react, {useState} from 'react';
import Selector from '../Forms/selector';
import styles from '../../styles/apply.module.scss';
import forms from '../../styles/forms.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import timezones from '../../json/timezones.json';

function AvaliablilityStep(props) {

    let [data, setData] = useState({}); 
    
    let onFormSubmit = (e) => {
        e.preventDefault();
        let submitter = e.nativeEvent.submitter.name;
        console.log(data);
        if(props.onSubmit){
            props.onSubmit(submitter, data);
        }
    };

    let startHourChange = (d) => {
        setData({ ...data, startHour: d.target.data});
    }

    let endHourChange = (d) => {
        setData({ ...data, endHour: d.target.data});
    }


    return (
        <div>
            <form onSubmit={onFormSubmit}>
                <div className={styles.multi_form}>
                    <span>Active hours (24 hour)</span>
                    <div className={styles.input_container}>
                        <input onChange={startHourChange} placeholder={"10:30"} />
                        <span>-</span>
                        <input onChange={endHourChange} placeholder={"23:45"} />
                    </div>
                </div>
                <Selector name={"Timezone"} inital={props.tz} image={"/clock.png"} items={timezones.map((d) => `${d.text}`)} ></Selector>
                <div className={styles.button_container_form}>
                        <button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`} name={"back"} >Go Back</button>
                        <button className={`${Buttons.small_button} ${Buttons.colored}`} name={"forward"}>Next</button>
                </div>
            </form>
        </div>
    )
}


export default AvaliablilityStep;