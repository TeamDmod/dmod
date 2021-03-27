const { Router } = require('express');
const Users = require('./v1/users');

let route = Router();

route.get("/", (req, res, next) => {
    res.json({hello: "world"});
})

/* V1 */
route.use("/v1/users", Users)


module.exports = route;