import axios from 'axios';
import {useState, useReducer, useEffect} from 'react';



const userReducer = (State, action) => {
    switch(action.type){
        case "loading":
            return { loading: true, data: undefined, error: undefined }
        case "success":
            return { loading: false, data: action.payload, error: undefined}
        case "error":
            return { loading: false, data: undefined, error: action.payload }
        default:
            throw new Error("Invalid user reducer action!");    
    }
};

export function useDiscordUser(access_token, refresh_token = null){
    const inital = {
        loading: true,
        data: undefined,
        error: undefined
    };

    const [state, dispatch] = useReducer(userReducer, inital);

    console.log(access_token);
    //shh i know this is really scuffed
    if(!state.data && !state.error){
        axios.get("https://discord.com/api/v8/users/@me", {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        }).then((res) => {
            dispatch({type: "success", payload: res.data});
        }).catch((err) => {
            dispatch({type: "error", payload: err.response.data});
        });
    }


    return state;
}

