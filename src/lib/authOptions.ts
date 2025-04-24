import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Adapter } from 'next-auth/adapters';
import clientPromise from './mongodb';
import { connectDB } from '@/lib/db';
import UserModel, { UserDocument } from '@/lib/models/User';
import { Types } from 'mongoose';

type Role = 'user' | 'admin';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as unknown as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          await connectDB();
          const dbUser = await UserModel.findOne({ googleId: user.id }).lean() as (UserDocument & { _id: Types.ObjectId }) | null;
          
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = (dbUser.role as Role) || 'user';
            token.googleId = dbUser.googleId;
          }
        } catch (error) {
          console.error("Error fetching DB user for JWT:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB();
          let dbUser = await UserModel.findOne({ googleId: user.id }).lean() as (UserDocument & { _id: Types.ObjectId }) | null;
          
          if (!dbUser) {
            await UserModel.create({
              googleId: user.id,
              email: profile.email,
              name: profile.name || profile.email,
              image: (profile as any)?.picture || undefined,
              role: 'user' as Role
            });
          }
          return true;
        } catch (error) {
          console.error('Error during signIn:', error);
          return false;
        }
      }
      return !!profile?.email;
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET!
};

