import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { hasBetaAccess } from 'lib/backend-utils';
import clientPromise from 'lib/mongodb';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
  verified: boolean;
  public_flags: number;
}

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
      profile(profile) {
        let image_url: string;

        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator, 10) % 5;
          image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        return {
          id: profile.id,
          uid: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: image_url,
          verified: profile.verified,
          public_flags: profile.public_flags,
          vanity: `${profile.id}`,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user,
      };
    },
    async signIn({ user }) {
      // Check for a development environment
      if (process.env.NODE_ENV === 'development') return true;

      // Check if the user has access to the beta
      const betaUser = user.beta || (await hasBetaAccess(user.id));
      return betaUser ? true : '/?error=AccessDenied';
    },
  },
});
