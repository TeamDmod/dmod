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
        _id: {
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
  if (!this.avatar) return `https://cdn.discordapp.com/embed/avatars/${+this.discriminator % 5}.png`;
  const isAnimated = this.avatar.startsWith('a_');
  return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${isAnimated ? 'gif' : 'png'}`;
});

Users.virtual('tag').get(function () {
  return `${this.username}#${this.discriminator}`;
});

export default mongoose.model['User'] ?? mongoose.model('Users', Users)
