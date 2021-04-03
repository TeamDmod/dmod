import React, { useState } from 'react'
import styles from '../../styles/apply.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import forms from '../../styles/forms.module.scss';
import FormField from '../Forms/text_area';
import Selector from '../Forms/selector';

function About(props) {

    let [data, setData] = useState({});

    let onFormSubmit = (e) => {
        e.preventDefault();

        let submitter = e.nativeEvent.submitter.name;

        if (props.onSubmit) {
            props.onSubmit(submitter, data);
        }
    }

    let onAboutChange = (d) => {
        setData({ ...data, about: d.target.data })
    }

    let onModChange = (d) => {
        setData({ ...data, about: d.target.data })
    }

    let onSelectorChange = (d) => {
        setData({ ...data, pronouns: d })
    }

    return (
        <>
            <form onSubmit={onFormSubmit}>
                <FormField onChange={onAboutChange} image={"/pencil.png"} placeholder={"Write your about text here"} name={"About"}></FormField>
                <FormField onChange={onModChange} image={"/pencil.png"} placeholder={"Write your text here"} name={"Why do you want to be a mod?"}></FormField>
                <Selector onChange={onSelectorChange} image={"gender.png"} name={"Pronouns (We also support pronoundb)"} items={["He/Him", "She/Her", "They/Them", "Other"]}></Selector>
                <div className={styles.button_container_form}>
                    <button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`} name={"back"} >Go Back</button>
                    <button className={`${Buttons.small_button} ${Buttons.colored}`} name={"forward"}>Next</button>
                </div>
            </form>
        </>
    );
}


export default About;