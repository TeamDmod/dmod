import axios from 'axios';
import {useState, useReducer, useEffect} from 'react';

const ipReducer = (s, a) => {
    switch(a.type){
        case "loading":
            return { loading: true, ipData: undefined, error: undefined }
        case "success":
            return { loading: false, ipData: a.payload, error: undefined}
        case "error":
            return { loading: false, ipData: undefined, error: a.payload }
        default:
            throw new Error("Invalid user reducer action!");    
    }
}


export default function useIp(){
    const inital = {
        loading: true,
        ipData: undefined,
        error: undefined,
    };

    const [state, dispatch] = useReducer(ipReducer, inital);

    if(!state.ipData && !state.error){
        axios.get("https://api.ipify.org/?format=json").then((res) => {
            axios.get(`https://timezoneapi.io/api/ip/?${res.data.ip}&token=agpTmvGtLzpZEAgbymNS`).then((res_) => {
                dispatch({type:"success", payload: res_.data})
            })
        }).catch(err => dispatch({type: "error", payload: err}));
    }

    return state;
}