require('dotenv').config();
const express = require('express');

let app = express();



app.listen(process.env.PORT ? process.env.PORT : "4000", () => {
    console.log(`Dmod backend running on port ${process.env.PORT ? process.env.PORT : "4000"}`)
})