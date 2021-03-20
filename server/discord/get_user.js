const axios = require('axios');
const user = require('../models/user');
const { DISCORD } = require('../config');

module.exports = (userid) => {
    axios.get(`https://discord.com/api/v8/users/${userid}`, {
        headers: {
            authorization: `Bot ${DISCORD.token}`
        }
    }).then((res) => {
        let user = res.data;

        return user;
    }).catch((err) => {
       return err.response.data;
    });
}