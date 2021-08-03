import mongoose, { model, Schema } from 'mongoose';

export interface StateTokenData {
  /** * Token key */
  token: string;
}

/**
 * Token used for discords oauth only
 * will expire after some time, if not used/deleted by the redirect and time passed
 */
const stateToken = new Schema({
  token: {
    type: String,
    required: true,
  },
  // https://stackoverflow.com/questions/38472125/delete-mongodb-document-at-specific-time#:~:text=To%20delete%20MongoDB%20document%20in,a%20certain%20amount%20of%20time.&text=create%20this%20index-,TestSchema.,%2C%20%7B%20expireAfterSeconds%3A%205%20%7D%20)%3B
  expiration: {
    type: Date,
    default: () => Date.now(),
    expires: 35 * 1000,
  },
});

export type StatetokenDataModule = mongoose.Model<StateTokenData>;

let StateTokenModule: StatetokenDataModule;
try {
  StateTokenModule = model('state_tokens', stateToken);
} catch (_) {
  StateTokenModule = model('state_tokens');
}
export default StateTokenModule;
