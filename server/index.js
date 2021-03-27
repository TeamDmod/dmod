require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const {graphqlHTTP} = require('express-graphql');
const auth = require('./routes/auth');
const api = require('./routes/api/index.js');
const schema = require('./schema/schema');
const bodyParser = require('body-parser');

let app = express();

app.use("/teapot", (req, res, next) => {
    res.json({teapot: "i am a teapot", code: 418}).statusCode(418)
});

app.use(
    "/gql",
    graphqlHTTP({
    schema: schema,
    graphiql: true,
    }));  
app.use(bodyParser({extended: false}))
app.use("/api", api);
app.use("/", auth);

mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to database");
});

app.listen(process.env.PORT ? process.env.PORT : "4000", () => {
    console.log(`Dmod backend running on port ${process.env.PORT ? process.env.PORT : "4000"}`)
})