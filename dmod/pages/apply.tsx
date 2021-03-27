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

                    <div className={`${styles.selector_panel}`} style={{float: "left", backgroundImage: `url(https://cdn.discordapp.com/attachments/797808681638690867/825316603004059658/unknown.png)`}}>
                        <div className={styles.tinted}></div>

                        <h3>Server Owner</h3>
                    </div>
                    <div className={`${styles.selector_panel}`} style={{float: "right", backgroundImage: "url(https://cdn.discordapp.com/attachments/797808681638690867/825316877534232617/unknown.png)"}}>
                    <div className={styles.tinted}></div>
                        <h3>Moderator</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
