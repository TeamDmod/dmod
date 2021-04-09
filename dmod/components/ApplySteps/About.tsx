import React, { useState } from 'react'
import styles from '../../styles/apply.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import forms from '../../styles/forms.module.scss';
import FormField from '../Forms/text_area';
import Selector from '../Forms/selector';
import DatePicker from '../Forms/date_picker';


function About(props) {

    let [data, setData] = useState({});
    let [focusedCalander, setFocused] = useState(false);
    let [date, setDate] = useState()
    let [aboutUnfilled, setAboutUnfilled] = useState(true);
    let [modUnfilled, setModUnfilled] = useState(true);
    let [genderUnfilled, setGenderUnfilled] = useState(true);
    let [birthdayUnfilled, setBirthdayUnfilled] = useState(true);

    let onFormSubmit = (e) => {
        e.preventDefault();

        let submitter = e.nativeEvent.submitter.name;
        console.log(data);

        //I know this is really bad, sorry!
        setAboutUnfilled(true);
        setModUnfilled(true);
        setGenderUnfilled(true);
        setBirthdayUnfilled(true);

        if(!data.about) return setAboutUnfilled(false);
        if(!data.description) return setModUnfilled(false);
        if(!data.pronouns) return setGenderUnfilled(false);
        if(!data.birthday) return setBirthdayUnfilled(false);

        if (props.onSubmit) {
            props.onSubmit(submitter, data);
        }
    }

    let onAboutChange = (d) => {
        console.log(d);
        setData({ ...data, about: d })
    }

    let onModChange = (d) => {
        console.log(d);
        setData({ ...data, description: d })
    }

    let onSelectorChange = (d) => {
        setData({ ...data, pronouns: d })
    }

    let onDateChange = (d) => {
        setData({...data, birthday: d});
    }

    return (
        <>
            <form onSubmit={onFormSubmit}>
                <FormField onChange={onAboutChange} filled={aboutUnfilled} image={"/pencil.png"} placeholder={"Write your about text here"} name={"About"}></FormField>
                <FormField onChange={onModChange} filled={modUnfilled} image={"/pencil.png"} placeholder={"Write your text here"} name={"Why do you want to be a mod?"}></FormField>
                <Selector onChange={onSelectorChange} filled={genderUnfilled} image={"gender.png"} name={"Pronouns (We also support pronoundb)"} items={["He/Him", "She/Her", "They/Them", "Other"]}></Selector>
                <DatePicker filled={birthdayUnfilled} onChange={onDateChange}></DatePicker>
                <div className={styles.button_container_form}>
                    <button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`} name={"back"} >Go Back</button>
                    <button className={`${Buttons.small_button} ${Buttons.colored}`} name={"forward"}>Next</button>
                </div>
            </form>
        </>
    );
}


export default About;