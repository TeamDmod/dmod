const axios = require('axios');
const user = require('../models/user');
const { DISCORD } = require('../config');

module.exports = (userid) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://discord.com/api/v8/users/${userid}`, {
            headers: {
                authorization: `Bot ${DISCORD.token}`
            }
        }).then((res) => {
            let user = res.data;
            resolve(user);
        }).catch((err) => {
           reject(err.response.data);
        });
    }) 
}