import {useEffect, useState, useRef} from 'react';
import Services from '../components/ApplySteps/Services';
import About from '../components/ApplySteps/About';
import styles from '../styles/apply.module.scss';
import {motion, useAnimation} from 'framer-motion';
import buttons from '../styles/buttons.module.scss';
import Step from '../components/ApplySteps/Step';

export default function Apply() {

    let [step, setStep] = useState(0);
    let [data, setData] = useState({});
    const mainRef = useRef();
    let animationController = useAnimation();


    let advanceStep = () => {
        if(step > applySteps.length) {
            console.log("setup done.. Submitting data.");
        }

        setStep(step + 1);

    };

    let setModerator = (e) => {
        advanceStep();
    }   

    let setOwner = (e) => {

    }

    let applySteps = [
        {
            step: 1,
            component: <Services setModerator={setModerator} setOwner={setOwner}></Services>,
            text: "Services",
            description: "What services are you looking for?",
            image: "/8rkjej.png"
        },
        {
            step: 2,
            component: <About />,
            text: "About",
            description: "Tell us about yourself!",
            image: "info.png"
        },
        {
            step: 3,
            component: null,
            text: "Availability",
            description: "When are you avalable?",
            image: "clock.png"
        },
        {
            step: 4,
            component: null,
            text: "Done!",
            description: "Publish your listing!",
            image: "draw.png"
        }
    ];

    
    return (
        <div>
            <div className={styles.container}>
                <h1>Welcome to Dmod.gg</h1>
                <p>Apply for a position, or start a campain.</p>
                <div className={styles.devider}></div>
                <div className={styles.main}>
                    <div className={styles.navigator}>
                        {applySteps.map(uwu => {
                            return <> 
                            <Step name={uwu.text} description={uwu.description} image={uwu.image}></Step> 
                            <div className={styles.spacer}></div>
                            </>
                        })}
                    </div>
                    
                    <motion.div animate={animationController} ref={mainRef} className={styles.content}>
                        {applySteps[step].component}
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
