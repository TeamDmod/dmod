import mongoose, { Schema } from 'mongoose';

import { FieldTypes } from './guilds';

const userApplication = new Schema({
  _id: {
    type: String,
  },
  guild_id: {
    type: String,
  },
  user_id: {
    type: String,
  },
  tag: {
    type: String,
  },
  appyingfor: {
    type: String,
  },
  replys: {
    type: Array,
  },
  status: {
    type: Number,
  },
  summery: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  apv: {
    type: Number,
    default: 1,
  },
});

export enum processingType {
  pending = 0,
  inReview = 1,
  accepted = 2,
  rejected = 3,
}

export interface fieldReply {
  field_id: string;
  type: FieldTypes;
  content: string | string[];
}

export interface sectionReply {
  section_id: string;
  fields: fieldReply[];
}

export interface userApplicationData {
  _id: string;
  guild_id: string;
  user_id: string;
  tag: string;
  avatar: string;
  /** Application version */
  apv: number;
  /**
   * Position this user applyed for in the server
   * Note: currenly only position is "moderator"
   */
  applyingfor: string;
  /**
   * Array of section field replys
   */
  replys: sectionReply[];
  /**
   * Status of this user application
   */
  status: processingType;
  /**
   * Summery for application reviewers to view first
   */
  summery: string | null;
}

export type credentialsDataModel = mongoose.Model<userApplicationData>;

let module: credentialsDataModel;
try {
  module = mongoose.model('user_applications', userApplication);
} catch (_) {
  module = mongoose.model('user_applications');
}
export default module;
