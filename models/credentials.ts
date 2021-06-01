import mongoose, { Schema } from 'mongoose';

const credentials = new Schema({
  _id: {
    type: String,
    required: true,
  },
  AccessToken: {
    type: String,
    required: true,
  },
  RefreshToken: {
    type: String,
    required: true,
  },
});

export type credentialsData = mongoose.Model<{
  _id: string;
  AccessToken: string;
  RefreshToken: string;
}>;

let module: credentialsData;
try {
  module = mongoose.model('credentials', credentials);
} catch (_) {
  module = mongoose.model('credentials');
}
export default module;
