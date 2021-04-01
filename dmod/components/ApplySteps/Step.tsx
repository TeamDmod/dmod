import React from 'react'
import styles from '../../styles/apply.module.scss';

function Step(props){
    return (
        <div className={styles.n_element}>
            <div className={styles.text}>
                <h3>{props.name}</h3>
                <p>{props.description}</p>
            </div>
            <div className={` ${styles.image} ${props.isHighlighted ? styles.filled : styles.non_filled} `}>
                <img src={props.image}></img>
            </div>
        </div>
    );
}

export default Step;