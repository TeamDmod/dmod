import { DEFAULT_BANNER_COLOR } from 'lib/constants';
import mongoose, { Schema } from 'mongoose';

const Users = new Schema(
  {
    _id: {
      type: String,
      required: true,
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
      default: `color:${DEFAULT_BANNER_COLOR}`,
    },
    discriminator: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    updates_access: {
      type: String,
      required: true,
      unique: true,
    },
    vanity: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    premium: {
      type: Number,
      default: 0,
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

Users.virtual('avatarURL').get(function avatarURL() {
  if (!this.avatar) return `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
  const isAnimated = this.avatar.startsWith('a_');
  return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${isAnimated ? 'gif' : 'png'}`;
});

Users.virtual('tag').get(function tag() {
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
  /**
   * User discription (makdown?)
   */
  description: string;
  /**
   * Public prefered pronouns
   */
  pronouns: string | null;
  /**
   * User's optional public status of activity
   */
  active: boolean;
  /**
   * The user's site flags
   */
  site_flags: number;
  /**
   * User profile banner
   */
  banner: string;
  discriminator: string;
  username: string;
  avatar: string | null;
  /**
   * Data on the users ratings
   */
  ratings: ratingData[];
  /**
   * A token to update the users data
   */
  updates_access: string;
  /**
   * The user's profile vanity
   */
  vanity: string;
  avatarURL: string;
  tag: string;
  /**
   * The type of premium this user has.
   */
  premium: number;
}

export type userModleData = mongoose.Model<userData>;

let userModule: userModleData;
try {
  userModule = mongoose.model('users', Users);
} catch (_) {
  userModule = mongoose.model('users');
}
export default userModule;
