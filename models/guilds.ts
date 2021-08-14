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
  application_status: {
    type: Number,
    default: 0,
  },
  application_status_data: {
    type: Object,
    default: {},
  },
  sections: {
    type: Array,
    default: [],
  },
  _apps: {
    type: String,
    default: '',
  },
  apv: {
    type: Number,
    default: 1,
  },
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

export interface section {
  postition: number;
  title: string;
  description: string;
  fields: FieldData[];
}

export enum FieldTypes {
  TEXT_SHORT = 0,
  TEXT_LONG = 1,
  CHOICE = 2,
  CHECKS = 3,
}

export enum ApplicationStatus {
  /** Applications are closed */
  CLOSED = 0,
  /** Applications are open */
  OPEN = 1,
  /** Applications are full */
  FULL = 2,
  /** Applications are opening at some time */
  OPENING = 3,
  /** Applications are open with a limit */
  LIMIT = 4,
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
  /** Application version */
  apv: number;
  _apps: String;
  /**
   * Data on the application status
   */
  application_status_data: any;
  /**
   * Status of the application
   */
  application_status: ApplicationStatus;
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
   * Form sections
   */
  sections: section[];
  /**
   * Server invite
   */
  invite: string | null;
}

export type GuildModleData = mongoose.Model<GuildData>;

let GuildModule: GuildModleData;
try {
  GuildModule = mongoose.model('guilds', Guilds);
} catch (_) {
  GuildModule = mongoose.model('guilds');
}
export default GuildModule;
