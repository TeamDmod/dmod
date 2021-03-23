import styles from '../styles/apply.module.scss';
import buttons from '../styles/buttons.module.scss';

export default function Apply() {
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.top_progress}></div>
                <div className={styles.container_main}>
                    <h1>Hi, Welcome to Dmod.gg.</h1>
                    <p>Before you can start filling out the application we need to know who you are.</p>

                    <button className={`${buttons.big_button} ${buttons.colored}`}>Server Owner</button>
                    <button className={`${buttons.big_button} ${buttons.colored}`}>Moderator</button>
                </div>
                <div className={styles.options}>
                    <button className={`${buttons.small_button} ${buttons.border}`}>Next</button>
                </div>
            </div>
        </div>
    );
}
