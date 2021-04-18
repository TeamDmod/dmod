const {Router} = require('express');
const Users = require('../../../models/user');
const checkauth = require('../../../middleware/checkauth');
const FetchUser = require('../../../discord/get_user');

let route = Router();


route.post("/:id/edit", checkauth, async (req, res, next) => {
    let user = await Users.findOne({user_id: req.params.id});
    let body = req.body;
    console.log(body)
    if(!user) return res.json({error: "Cannot find user!"});

    if(req.user.id !== user.user_id) return res.json({error: "You are not permitted to edit this user!"})


    if(!body.bio && !body.username || !body) return res.json({error: "You cant update nothing!"}).end();

    user.bio = body.bio ? body.bio : user.bio;
    user.username = body.username ? body.username : user.username;

    await user.save();

    return res.json({user: user});
});

route.get("/:id", async (req, res, next) => {
    
    let user = await Users.findOne({user_id: req.params.id});

    if(!user) return res.json({error: "Cannot find user!"});
    
    let discord_user = await FetchUser(user.user_id);

    let avatar = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`;


    if (discord_user.discriminator !== user.tag) {
        user.tag = discord_user.discriminator;
        await user.save();
    }
    
    if(discord_user.avatar !== user.avatar) {
        user.avatar = avatar
        await user.save();
    }    

    res.json({user: user});
});

module.exports = route;