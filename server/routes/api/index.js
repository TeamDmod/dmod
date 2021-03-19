const { Router } = require('express');

let route = Router();

route.get("/", (req, res, next) => {
    res.json({hello: "world"});
})

/* V1 */



module.exports = route;