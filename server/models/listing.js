const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    id: {
        type: String
    }
});

module.exports = model("listing", UserSchema, "listing");
