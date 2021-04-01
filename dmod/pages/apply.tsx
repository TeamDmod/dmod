import { useEffect, useState, useRef } from 'react';
import Services from '../components/ApplySteps/Services';
import About from '../components/ApplySteps/About';
import styles from '../styles/apply.module.scss';
import { motion, useAnimation } from 'framer-motion';
import buttons from '../styles/buttons.module.scss';
import Step from '../components/ApplySteps/Step';

export default function Apply() {

    let [step, setStep] = useState(0);
    let [data, setData] = useState({});
    const mainRef = useRef();
    let animationController = useAnimation();


    let advanceStep = () => {
        if (step > applySteps.length) {
            console.log("setup done.. Submitting data.");
        }

        console.log(step2)

        setStep(step + 1);

    };

    let setModerator = (e) => {
        advanceStep();
    }

    let setOwner = (e) => {

    }

    const step1 = useRef();
    const step2 = useRef();
    const step3 = useRef();
    const step4 = useRef();
    const step5 = useRef();

    const applySteps = [
        {
            step: 1,
            component: <Services setModerator={setModerator} setOwner={setOwner}></Services>,
            text: "Services",
            description: "What services are you looking for?",
            image: "/8rkjej.png",
            navigator_ref: step1
        },
        {
            step: 2,
            component: <About />,
            text: "About",
            description: "Tell us about yourself!",
            image: "info.png",
            navigator_ref: step2,
        },
        {
            step: 3,
            component: null,
            text: "Availability",
            description: "When are you avalable?",
            image: "clock.png",
            navigator_ref: step3
        },
        {
            step: 4,
            component: null,
            text: "Done!",
            description: "Publish your listing!",
            image: "draw.png",
            navigator_ref: step4
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
                        {applySteps.map((uwu, index) => {
                            return <>
                                <Step key={index} ref={step2} name={uwu.text} description={uwu.description} image={uwu.image}></Step>
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
