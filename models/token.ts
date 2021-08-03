import mongoose, { model, Schema } from 'mongoose';

export interface TokenData {
  /** * Typeof token */
  type: 'user' | 'gatewayGuild' | 'gatewayUser';
  /** * Token key */
  token: string;
  /** * The id if the corresponding id object (guildID/userID) */
  for: string;
  /** * Token hashed */
  tokenHash: string;
  /** * Times token has been used */
  use: number;
}

const Token = new Schema({
  type: {
    type: String,
    required: true,
  },
  for: {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
  tokenHash: {
    type: String,
  },
  use: {
    type: Number,
    min: 0,
    default: 0,
  },
});

export type tokenDataModule = mongoose.Model<TokenData>;

let tokenModule: tokenDataModule;
try {
  tokenModule = model('tokens', Token);
} catch (_) {
  tokenModule = model('tokens');
}
export default tokenModule;
