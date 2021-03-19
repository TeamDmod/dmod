import { useDiscordUser } from '../discord/user';
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Callback(props) {

    const { query } = useRouter();

    if (!query.code) return (
        <div className="centered">
            <h1>Please wait, we are trying to log you in!</h1>
            <p>Did you know that dmod is cool?</p>
        </div>
    );

    let { loading, data, error } = useDiscordUser(query.code, query.refresh);


    if (loading) return (
        <div className="centered">
            <h1>Please wait, we are trying to log you in!</h1>
            <p>Did you know that dmod is cool?</p>
        </div>
    );

    setTimeout(() => Router.push('/'), 1000)

    return (
        <div className="centered">
            <h1>Welcome {data.username}!</h1>
            <p>Redirecting you...</p>

        </div>
    );
}
