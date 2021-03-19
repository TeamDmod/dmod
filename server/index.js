require('dotenv').config();
const express = require('express');
const api = require('./routes/api/index.js');

let app = express();

app.use("/api", api)

app.listen(process.env.PORT ? process.env.PORT : "4000", () => {
    console.log(`Dmod backend running on port ${process.env.PORT ? process.env.PORT : "4000"}`)
})