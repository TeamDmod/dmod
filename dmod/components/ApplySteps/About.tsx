import React from 'react'
import styles from '../../styles/apply.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import forms from '../../styles/forms.module.scss';
import FormField from '../Forms/text_area';

function About(props) {
    return (
        <>
            <form>
                <FormField image={"/pencil.png"} placeholder={"Write your about text here"} name={"About"}></FormField>
                <FormField image={"/pencil.png"} placeholder={"Write your text here"} name={"Why do you want to be a mod?"}></FormField>
                <div className={styles.button_container_form}>
                    <button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`}>Go Back</button>
                    <button className={`${Buttons.small_button} ${Buttons.colored}`}>Next</button>
                </div>
            </form>
        </>
    );
}


export default About;