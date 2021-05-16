import { useEffect, useState, useRef } from 'react';
import Services from '../components/ApplySteps/Services';
import About from '../components/ApplySteps/About';
import Avaliablility from '../components/ApplySteps/Avaliablilty';
import styles from '../styles/apply.module.scss';
import { motion, useAnimation } from 'framer-motion';
import useIp from '../hooks/useIp';
import buttons from '../styles/buttons.module.scss';
import Step from '../components/ApplySteps/Step';
import axios from 'axios';

export default function Apply() {

    let [step, setStep] = useState(0);
    let [data, setData] = useState({});
    const mainRef = useRef();
    let animationController = useAnimation();
    let {ipData, loading , error} = useIp();
    console.log(ipData);
    let advanceStep = () => {
        if (step > applySteps.length) {
            console.log("setup done.. Submitting data.");
        }

        console.log(data);
        setStep(step + 1);

    };

    let goBack = () => {
        setStep(step - 1);
    }

    let setModerator = (e) => {
        advanceStep();
    }

    let setOwner = (e) => {

    }

    let handleAboutData = (submitter, newData) => {
        switch (submitter) {
            case "forward":
                advanceStep()
                console.log(newData);
                setData({ ...data, about: newData.about, description: newData.description, pronouns: newData.pronouns, birthday: newData.birthday })
                break;
            case "back":
                goBack()
                break;
            default:
                break;

        }
    }


    let handleAvaliablilityData = (submitter, newData) => {
        switch(submitter) {
            case "forward":
                advanceStep();
                setData({...data, newData});
                break;
            case "back":
                goBack()
                setData({...data, newData});
                break;
            default:
                break;
        }
    };

    const applySteps = [
        {
            step: 1,
            component: <Services setModerator={setModerator} setOwner={setOwner}></Services>,
            text: "Welcome to dmod.gg!",
            description: "Lets get started on your listing! First off we need to know who you are!",
            image: "/8rkjej.png"
        },
        {
            step: 2,
            component: <About onSubmit={handleAboutData} data={data} />,
            text: "Who are you??",
            description: "Tell us about yourself! Include things on your hobbys and your interests! It might help the server owner!",
            image: "info.png"
        },
        {
            step: 3,
            component: <Avaliablility onSubmit={handleAvaliablilityData} tz={ipData?.data.datetime?.offset_tzab} />,
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
                <h1>{applySteps[step].text}</h1>
                <p>{applySteps[step].description}</p>
                <div className={`${styles.main}`}>
                    <motion.div animate={animationController} ref={mainRef} className={`${styles.content}`}>
                        {applySteps[step].component}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
