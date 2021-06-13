import mongoose, { Schema } from 'mongoose';

const previewGuild = new Schema({
  _id: {
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
  short_description: string;
  look_types: string[];
  completed: boolean;
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
