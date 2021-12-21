import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { hasBetaAccess } from 'lib/backend-utils';
import { prisma } from 'lib/prisma';
import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
      profile(profile) {
        let image_url: string;
        let banner: string;

        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator, 10) % 5;
          image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        if (profile.banner === null) {
          banner = `color:${profile.banner_color}`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          banner = `https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}.${format}`;
        }

        return {
          id: profile.id,
          uid: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: image_url,
          profile: {
            create: {
              bio: "I'm new to dmod! Not much is known about me yet :(",
              public: false,
              banner,
              flags: 0,
            },
          },
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
  secret: process.env.AUTH_SECRET,
});
