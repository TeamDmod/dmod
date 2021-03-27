const {Router} = require('express');
const Users = require('../../../models/user');
const checkauth = require('../../../middleware/checkauth');

let route = Router();


route.post("/:id/edit", checkauth, async (req, res, next) => {
    let user = await Users.findOne({user_id: req.params.id});

    if(!user) return res.json({error: "Cannot find user!"});

    if(req.user.id !== user.user_id) return res.json({error: "You are not permitted to edit this user!"})

});

route.get("/:id", async (req, res, next) => {
    let user = await Users.findOne({user_id: req.params.id});

    if(!user) return res.json({error: "Cannot find user!"});

    res.json({user: user});
});

module.exports = route;