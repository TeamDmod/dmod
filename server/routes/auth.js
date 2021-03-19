const {Router} = require('express');
const { DISCORD } = require('../config');
const axios = require('axios');
const qs = require('querystring');

let route = Router();

route.get("/login", (req, res, next) => {
    res.redirect(`https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD.client_id}&scope=${DISCORD.scopes.join("%20")}&redirect_uri=${DISCORD.callback_uri}&prompt=consent`)
});

route.get("/callback", (req, res, next) => {
    
    if(!req.query.code) return res.json({error: "You must provide a callback code!"});

    let data = {
        client_id: DISCORD.client_id,
        client_secret: DISCORD.clinet_secret,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: DISCORD.callback_uri,
        scope: DISCORD.scopes.join(" ")
    };

    axios.post("https://discord.com/api/v8/oauth2/token", qs.stringify(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((res) => {
        console.log(res.data);
    }).catch((err) => {
        console.log(err.response.data);
    });

});

module.exports = route;