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
  postition: number;
  title: string;
  description: string;
  type: FieldTypes;
  length: [number, number];
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
  description: string;
  short_description: string;
  recruiting: number;
  applyed: string[];
  look_types: string[];
  view: boolean;
  completed: boolean;
  tags: string[];
  other_fields: FieldData[];
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
