const {Router} = require('express');
const Users = require('../../../models/user');

let route = Router();


route.get("/:id", async (req, res, next) => {
    let user = await Users.findOne({user_id: req.params.id});

    if(!user) return res.json({error: "Cannot find user!"});

    res.json({user: user});
});

module.exports = route;