import mongoose, { Schema } from 'mongoose';

const Guilds = new Schema({
  _id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  recruiting: {
    type: Number,
    default: 1,
  },
  applyed: {
    type: Array,
    default: [],
  },
  look_types: {
    type: Array,
    default: ['moderator'],
  },
  view: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Array,
    default: [],
  },
  invite: {
    type: String,
    default: null,
  },
  owner_id: {
    type: String,
    required: true,
  },
  other_fields: [
    {
      postition: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
      type: {
        type: Number,
        default: 0,
      },
      length: {
        type: Array,
        default: null,
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  _access_key: {
    type: String,
    required: true,
  },
  // required_age: {
  //   type: []
  // }
});

export interface FieldData {
  /**
   * Postition of this field
   */
  postition: number;
  title: string;
  description: string;
  type: FieldTypes;
  /**
   * The max and min length content can be if text or choice
   */
  length: [number, number];
  /**
   * If field is required
   */
  required: boolean;
}

export enum FieldTypes {
  TEXT_SHORT = 0,
  TEXT_LONG = 1,
  CHOICE = 2,
  CHECKS = 3,
}

export interface GuildData {
  _id: string;
  /**
   * Id of server owner used to display on the owners profile
   */
  owner_id: string;
  /**
   * Server description (markdown?)
   */
  description: string;
  short_description: string;
  /**
   * The amount of people that this server is looking for default 1
   */
  recruiting: number;
  /**
   * User string id array
   */
  applyed: string[];
  /**
   * Array of available position this server is looking for
   */
  look_types: string[];
  /**
   * If this server is available to view
   */
  view: boolean;
  /**
   * If the server is completed
   */
  completed: boolean;
  /**
   * Array of string tags
   */
  tags: string[];
  /**
   * Fields object array
   */
  other_fields: FieldData[];
  /**
   * Server invite
   */
  invite: string | null;
  /**
   * Key to update this guild application
   */
  _access_key: string;
}

export type GuildModleData = mongoose.Model<GuildData>;

let GuildModule: GuildModleData;
try {
  GuildModule = mongoose.model('guilds', Guilds);
} catch (_) {
  GuildModule = mongoose.model('guilds');
}
export default GuildModule;
