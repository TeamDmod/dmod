const {Router} = require('express');
const { DISCORD } = require('../config');
const users = require('../models/user');
const axios = require('axios');
const qs = require('querystring');

let route = Router();

route.get("/login", (req, res, next) => {
    res.redirect(`https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD.client_id}&scope=${DISCORD.scopes.join("%20")}&redirect_uri=${DISCORD.callback_uri}&prompt=consent`)
});

route.get("/callback", async (req, res, next) => {
    
    if(!req.query.code) return res.json({error: "You must provide a callback code!"});

    let data = {
        client_id: DISCORD.client_id,
        client_secret: DISCORD.clinet_secret,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: DISCORD.callback_uri,
        scope: DISCORD.scopes.join(" ")
    };

    //callback hell
    axios.post("https://discord.com/api/v8/oauth2/token", qs.stringify(data), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((result) => {

        let access_token = result.data.access_token;
        let refresh_token = result.data.refresh_token; 
        
        axios.get("https://discord.com/api/v8/users/@me", {
            headers: {
                authorization: `Bearer ${access_token}`
            }
        }).then(async (res_) => {
            let user = res_.data;

            let checkuser = await users.findOne({user_id: user.id});

            if(!checkuser){
                checkuser = await new users({
                    username: user.username,
                    user_id: user.id,
                    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
                    bio: "We dont know much about this user...",
                    tag: user.discriminator
                }).save();
            }

            res.redirect(`http://localhost:3000/callback?code=${access_token}&refresh=${refresh_token}`);
        }).catch((err) => {
            console.log(err);
            res.json({oops: "There was an error processing your request!", error: err.response.data})
        })

    }).catch((err) => {
        res.json({oops: "There was an error processing your request!", error: err.response.data})
    });

});

module.exports = route;