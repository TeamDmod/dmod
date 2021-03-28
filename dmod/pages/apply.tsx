import {useEffect, useState} from 'react';
import styles from '../styles/apply.module.scss';
import buttons from '../styles/buttons.module.scss';

export default function Apply() {

    let [step, setStep] = useState(0);

    return (
        <div>
            <div className={styles.container}>
                <h1>Welcome to Dmod.gg</h1>
                <p>Apply for a position, or start a campain.</p>
                <div className={styles.devider}></div>
                <div className={styles.main}>
                    <div className={styles.navigator}>
                        <div className={styles.n_element}>
                            <div className={styles.text}>
                                <h3>Services</h3>
                                <p>What services are you looking for?</p>
                            </div>
                            <div className={` ${styles.image} ${styles.filled} `}>
                                <img src={"/8rkjej.png"}></img>
                            </div>
                        </div>
                        <div className={styles.spacer}></div>
                        <div className={styles.n_element}>
                            <div className={styles.text}>
                                <h3>About</h3>
                                <p>Tell us about yourself.</p>
                            </div>
                            <div className={` ${styles.image} ${styles.non_filled} `}>
                                <img src={"/info.png"}></img>
                            </div>
                        </div>
                        <div className={styles.spacer}></div>
                        <div className={styles.n_element}>
                            <div className={styles.text}>
                                <h3>Availability</h3>
                                <p>When are you avalable?</p>
                            </div>
                            <div className={` ${styles.image} ${styles.non_filled} `}>
                                <img src={"/clock.png"}></img>
                            </div>
                        </div>
                        <div className={styles.spacer}></div>
                        <div className={styles.n_element}>
                            <div className={styles.text}>
                                <h3>Done!</h3>
                                <p>Publish your listing!</p>
                            </div>
                            <div className={` ${styles.image} ${styles.non_filled} `}>
                                <img src={"/8rkjej.png"}></img>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
