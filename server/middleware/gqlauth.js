const axios = require('axios');

module.exports = async function authenticate(parent, args, context) {
    console.log("uwu");
    if(!context.headers.authorization) throw new Error("No authentication provided!");

    await axios.get(`https://discord.com/api/v8/users/@me`, {
        headers: {
            authorization: `Bearer ${context.headers.authorization}`
        }
    }).then((res) => {
        let user = res.data;

        return user;
    }).catch((err) => {
        throw new Error("Incorrect authentication provided!");
    });
} 