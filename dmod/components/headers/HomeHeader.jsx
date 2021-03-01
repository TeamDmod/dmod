import React from 'react'
import home from '../../styles/home.module.scss';

function HomeHeader() {
    return(
        <div className={home.main_header}>

            <div className={home.text_headings}>
                <h1>Say goodbye to moderator applications...</h1>
                <p>Discords most advanced moderator searching application.</p>
            </div>
        </div>
    )
}

export default HomeHeader;