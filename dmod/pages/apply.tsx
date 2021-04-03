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
            text: "Welcome to dmod.gg!",
            description: "Lets get started on your listing! First off we need to know who you are!",
            image: "/8rkjej.png",
            navigator_ref: step1
        },
        {
            step: 2,
            component: <About />,
            text: "Who are you??",
            description: "Tell us about yourself! Include things on your hobbys and your interests! It might help the server owner!",
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
                <h1>{applySteps[step].text}</h1>
                <p>{applySteps[step].description}</p>
                <div className={styles.main}>
                    <motion.div animate={animationController} ref={mainRef} className={styles.content}>
                        {applySteps[step].component}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
