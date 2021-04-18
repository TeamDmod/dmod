import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import Preloader from '../../components/preloader';
import { GetUser } from '../../requests/api';
import { useRouter } from 'next/router';
import styles from '../../styles/user.module.scss';
import { usePopper } from 'react-popper';


function Badge(props){

    const badgeRef = useRef(null);
    const arrowElement = useRef(null);
    const popperElement = useRef(null);
    
    const popper = usePopper(badgeRef, popperElement, {
        modifiers: [{ name: 'arrow', options: { element: arrowElement } }, {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          }],
    });

    return (
        <>
            <div className={styles.tag} ref={badgeRef} ><img src={"/nitro.webp"} alt=""/></div>
            
            <div ref={popperElement} style={popper.styles.popper} {...popper.attributes.popper}>
                Nitro
                <div ref={arrowElement} style={popper.styles.arrow}></div>
            </div>
        </>
    )
}

function User(){

    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(id){
            GetUser(id).then((res) => {
                setUser(res.data.user);
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
                Router.push("/404");
            })
        }
    }, [id]);

    if(loading) return <Preloader></Preloader>;
    
    return (
        <div className={styles.container}>

            <div className={styles.inner}>
                <div className={styles.user_banner} style={{ backgroundImage: "url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffw800%2Fback_our%2F20190621%2Fourmid%2Fpngtree-c4d-neon-cool-background-image_205279.jpg&f=1&nofb=1)"}}></div>
                <div className={styles.user_info}>
                    <img src={user.avatar} className={styles.pfp}></img>
                    <div>
                        <h1>{user.username}<span>#{user.tag}</span></h1>
                        <div className={styles.tag_container}>
                            <Badge></Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;