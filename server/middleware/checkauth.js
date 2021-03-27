const axios = require('axios');

module.exports = (req, res, next) => {
    if(!req.headers.authorization) return res.json({error: "No authorization!"}).status(401).end()

    axios.get("https://discord.com/api/v8/users/@me", {
        headers: {
            authorization: `Bearer ${req.headers.authorization}`
        }
    }).then((res_) => {
        if(res_.data){
            req.user = res_.data;
            next();
        } else {
            res_.json({error: "Internal server error!"}).status(500);
        }
    }).catch((err) => {
        console.log(err);
        res.json({error: "Bad auth!"}).status(403);
    });
};