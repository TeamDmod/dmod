const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
  },
  avatar: {
    type: String,
  },
  flags: {
    type: Array,
  },
  badges: {
    type: Array,
  },
  join_date: {
    type: Date,
    default: () => new Date.now()
  },
  cv_id: {
    type: String 
  }
});

module.exports = model("user", UserSchema, "users");
