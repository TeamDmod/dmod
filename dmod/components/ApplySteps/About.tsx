import React from 'react'
import styles from '../../styles/apply.module.scss';
import Buttons from '../../styles/buttons.module.scss';
import forms from '../../styles/forms.module.scss';

function About(props){
    return (
        <>
            <div className={styles.text_headings}>
                <h1>Tell us about yourself..</h1>
                <p>Plesae provide us a TLDR and a long version of why you want to be a mod</p>
            </div>
            <form>
                <input className={forms.outline_input} placeholder={"Give a short description about yourself"} />
                <br></br>
                <textarea className={forms.text_area} placeholder={"Tell us why you want to be a mod"} />
                <div className={styles.button_container_form}>
                    <button className={`${Buttons.small_button} ${Buttons.border} ${forms.button_spacer}`}>Go Back</button>
                    <button className={`${Buttons.small_button} ${Buttons.colored}`}>Next</button>
                </div>
            </form>
        </>
    );
}


export default About;