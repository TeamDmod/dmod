// NOTE: Could be deleted as the db will be interacted with by 'lib/mongodb.connection.ts'
// and will only need to move typings to typings file(s)
import mongoose, { Schema } from 'mongoose';

const Users = new Schema(
  {
    id: { type: String, unique: true, required: true },
    _id: {
      default: () => new Date(),
      type: Date,
    }, //added at
    username: { type: String, required: true },
    avatar: { type: String, default: null },
    discriminator: { type: String, required: true },
    description: { type: String, required: true },
    about: { type: String, required: true },
    available: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    tz: String,
    ratings: [
      {
        _id: { /*time of making this*/
          default: () => new Date(),
          type: Date,
        },
        id: { type: String, required: true, unique: true },
        positive: { type: Boolean, required: true },
        comment: { type: String, required: true },
      },
    ],
  },
  { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

Users.virtual('avatarURL').get(function () {
  if (!this.avatar) return `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
  const isAnimated = this.avatar.startsWith('a_');
  return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${isAnimated ? 'gif' : 'png'}`;
});

Users.virtual('tag').get(function () {
  return `${this.username}#${this.discriminator}`;
});

type userData = mongoose.Model<any>;

let module: userData;
try {
  module = mongoose.model('Users', Users);
} catch (_) {
  module = mongoose.model('Users');
}
export default module;
