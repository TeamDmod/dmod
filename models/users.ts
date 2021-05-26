const mongoose = require('mongoose');
  const { Schema } = mongoose;
  const Users = new Schema({
   id: {type: String, unique: true, required: true},
   _id: {
    default: () => new Date(),
    type: Date
  }, //added at
  username: {type: String, unique: true, required: true},
  avatar: {type: String, unique:true, required: true},
  discriminator: {type: String, required: true},
  description: {type: String, required: true},
  about: {type: String, required: true},
  available: {
   from: {type: Date, required: true},
   to: {type: Date, required: true}
  },
  tz:String,
  ratings: [{
   _id: {
    default: () => new Date(),
    type: Date
  },
   id: {type: String, required: true, unique: true},
   positive: {type: Boolean, required: true},
   comment: {type: String, required: true}
  }]
  },{ versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true }});

Users.virtual('avatarURL').get( () => {
  if ( (this.avatar === "1") || (this.avatar==="2") || (this.avatar=="3") || (this.avatar === "4") ) return `https://cdn.discordapp.com/embed/avatars/${this.avatar}.png`;
  else {
    const ani = this.avatar.startsWith("a_") ? true : false;
    const aniurl = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.gif`;
    const nonurl = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    const url = ani ? aniurl : nonurl;
    return url;
  };
});
Users.virtual('tag').get(function(){
 return `${this.username}#${this.discriminator}`;
})

var users;
try{
console.log("[DB] Compiling Schema into Model - Users");
users = mongoose.model('Users', Users);
}
catch(e){
 users = mongoose.model('Users');
}
module.exports = users;

// try catch like this allows you to use this schema in multiple files ;)
