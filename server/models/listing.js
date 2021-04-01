const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    id: String,
    type: String,
    user_id: String,
    
});

module.exports = model("listing", UserSchema, "listing");
