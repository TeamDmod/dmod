import mongoose, { Schema } from 'mongoose';

import { ApplicationStatus } from './guilds';

const previewGuild = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  owner_id: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
    required: true,
  },
  look_types: {
    type: Array,
    default: ['moderator'],
  },
  application_status: {
    type: Number,
    default: 0,
  },
  application_status_data: {
    type: Object,
    default: {},
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
});

export interface PreviewGuildData {
  _id: string;
  /**
   * Id of server owner used to display on the owners profile
   */
  owner_id: string;
  name: string;
  short_description: string;
  application_status: ApplicationStatus;
  application_status_data: any;
  look_types: string[];
  completed: boolean;
  view: boolean;
  tags: string[];
}

export type PreviewGuildModleData = mongoose.Model<PreviewGuildData>;

let PreviewGuildModule: PreviewGuildModleData;
try {
  PreviewGuildModule = mongoose.model('preview_guilds', previewGuild);
} catch (_) {
  PreviewGuildModule = mongoose.model('preview_guilds');
}
export default PreviewGuildModule;
