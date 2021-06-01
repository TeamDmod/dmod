import mongoose, { Schema, Document } from 'mongoose';

const Users = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    pronouns: {
      type: String,
      default: null,
    },
    site_flags: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: 'No description found.',
    },
    banner: {
      type: String,
      default: null,
    },
    discriminator: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    ratings: [
      {
        _id: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: () => new Date(),
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Users.virtual('avatarURL').get(function () {
  if (!this.avatar) return `https://cdn.discordapp.com/embed/avatars/${+this.discriminator % 5}.png`;
  const isAnimated = this.avatar.startsWith('a_');
  return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${isAnimated ? 'gif' : 'png'}`;
});

Users.virtual('tag').get(function () {
  return `${this.username}#${this.discriminator}`;
});

export interface ratingData {
  _id: string;
  createdAt: Date;
  comment: string;
  rating: number;
}

export interface userData {
  _id: string;
  description: string;
  pronouns: string | null;
  active: boolean;
  site_flags: number;
  banner: null;
  discriminator: string;
  username: string;
  avatar: string | null;
  ratings: ratingData[];
  avatarURL: string;
  tag: string;
}

export type userModleData = mongoose.Model<userData>;

let module: userModleData;
try {
  module = mongoose.model('users', Users);
} catch (_) {
  module = mongoose.model('users');
}
export default module;
