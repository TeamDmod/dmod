// import { MongoClient, Db, Collection } from 'mongodb';
// import type { Model } from 'mongoose';

// const { MONGODB_URI, MONGODB_DB } = process.env;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env');
// }

// if (!MONGODB_DB) {
//   throw new Error('Please define the MONGODB_DB environment variable inside .env');
// }

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// // @ts-expect-error
// let cached = global.mongo;

// if (!cached) {
// // @ts-expect-error
//   cached = global.mongo = { conn: null, promise: null };
// }

// type connection = {
//   client: MongoClient;
//   db: Db;
//   credentials: Collection<credentialsData>;
//   users: Collection<usersData>;
// };
// export async function connectToDatabase(): Promise<connection> {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };

//     cached.promise = MongoClient.connect(MONGODB_URI, opts).then(client => {
//       const db = client.db(MONGODB_DB);
//       return {
//         client,
//         db,
//         credentials: db.collection('credentials'),
//         guilds: db.collection('guilds'),
//         users: db.collection('users'),
//         previewGuilds: db.collection('preview_guilds'),
//         userApplications: db.collection('User_applications'),
//       };
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export type credentialsData = Model<{
//   _id: string;
//   AccessToken: string;
//   RefreshToken: string;
// }>;

// export interface Iuser {
//   _id: string;
//   description: string;
//   pronouns: string | null;
//   active: boolean;
//   banner: null;
//   site_flags: number;
// }

// export type usersData = Model<Iuser, {}, Iuser>;

/**
 * Templated off https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-expect-error
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
