import Head from 'next/head';
import React from 'react';


function OGH(props){
    return (
        <Head>
            <meta property="og:title" content={props.title}></meta>
            <meta property="og:site_name" content="Dmod.gg"></meta>
            <meta property="og:description" content={props.description}></meta>
            <meta property="og:image" content={props.image}></meta>
        </Head>
    );
}

export default OGH;