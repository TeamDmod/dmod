import axios, { AxiosResponse } from 'axios';

const baseURL = process.env.BASE_URL;

export function GetUser(id) : Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
        axios.get(`${baseURL}/users/${id}`).then(resolve).catch(reject);
    });
};
