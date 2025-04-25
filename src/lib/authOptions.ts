// src/lib/authOptions.ts
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Adapter } from 'next-auth/adapters'; // Use type from next-auth
import clientPromise from './mongodb';
import { connectDB } from '@/lib/db';
import UserModel, { UserDocument } from '@/lib/models/User';
import { Types } from 'mongoose';

type Role = 'user' | 'admin';

// Define a user type that includes our custom fields
interface AppUser extends NextAuthUser {
  id: string;
  role: Role;
  googleId?: string; // Optional, might not be present for credentials user
}

export const authOptions: NextAuthOptions = {
  // Adapter setup
  adapter: MongoDBAdapter(clientPromise) as Adapter, // Cast to the correct Adapter type

  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Admin Direct Login Provider (for dev/testing)
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Direct Login',
      credentials: {}, // No input credentials needed
      async authorize(credentials, req) {
        try {
          await connectDB();
          const adminEmail = 'admin@test.com';
          let adminUser = await UserModel.findOne({ email: adminEmail }).lean() as (UserDocument & { _id: Types.ObjectId }) | null;

          if (!adminUser) {
            // Create the admin user if it doesn't exist
            const created = await UserModel.create({
              email: adminEmail,
              name: 'Test Admin',
              role: 'admin' as Role,
              googleId: `admin-${Date.now()}`, // Ensure unique googleId if needed by schema
              image: `https://www.gravatar.com/avatar/${Date.now()}?d=mp&f=y` // Placeholder image
            });
             // Re-fetch after creation to ensure _id is available and correctly typed
             adminUser = await UserModel.findOne({ email: adminEmail }).lean() as (UserDocument & { _id: Types.ObjectId }) | null;
          }

          if (adminUser) {
            // Return the user object required by NextAuth authorize
            return {
              id: adminUser._id.toString(),
              name: adminUser.name,
              email: adminUser.email,
              image: adminUser.image,
              role: adminUser.role, // Ensure role is included
            } as AppUser; // Assert as our extended AppUser type
          } else {
            console.error("Failed to find or create admin test user.");
            return null; // Return null if user not found/created
          }
        } catch (error) {
           console.error("Error in admin-login authorize:", error);
           return null;
        }
      }
    })
  ],

  callbacks: {
    // signIn: Handle logic after successful authorize or provider redirect
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB();
          const userEmail = profile.email;
          const isAdminEmail = userEmail === 'moldovancsaba@gmail.com';
          const targetRole: Role = isAdminEmail ? 'admin' : 'user';

          // Check if user exists based on googleId (user.id from provider)
          let dbUser = await UserModel.findOne({ googleId: user.id }).lean() as (UserDocument & { _id: Types.ObjectId }) | null;

          if (!dbUser) {
            // Create user if they don't exist
            await UserModel.create({
              googleId: user.id,
              email: userEmail,
              name: profile.name || userEmail,
              image: user.image || (profile as any)?.picture || undefined,
              role: targetRole // Assign role during creation
            });
            console.log(`Created user ${userEmail} with role ${targetRole}`);
          } else if (isAdminEmail && dbUser.role !== 'admin') {
            // Update role if user exists and should be admin but isn't
            await UserModel.updateOne({ _id: dbUser._id }, { $set: { role: 'admin' as Role } });
            console.log(`Updated user ${userEmail} to admin role.`);
            // Note: JWT callback needs to fetch role again to see this update immediately
          }
          return true; // Allow sign in
        } catch (error) {
          console.error('Error during Google signIn DB check/update:', error);
          return false; // Prevent sign in on DB error
        }
      }
      // Allow sign in if authorize returned a user (e.g., for admin-login)
      if (account?.provider === 'admin-login' && user) {
        return true;
      }
      // Deny sign in for other cases
      return false;
    },

    // jwt: Encode user info into the JWT
    async jwt({ token, user, account }) {
      // On initial sign-in, add id and role to the token
      if (account && user) {
        const appUser = user as AppUser; // Cast user to our extended type
        token.id = appUser.id;
        token.role = appUser.role || 'user'; // Use role from user object passed by signIn/authorize

        // If Google sign-in, potentially re-fetch role from DB to ensure consistency
        // Especially important if signIn might update the role *after* the user object is initially formed
        if (account.provider === 'google') {
           try {
             await connectDB();
             const dbUser = await UserModel.findById(appUser.id).lean() as (UserDocument & { _id: Types.ObjectId }) | null;
             token.role = dbUser?.role as Role || 'user'; // Trust DB role
           } catch (error) {
              console.error("Error fetching DB role for JWT:", error);
              token.role = 'user'; // Default on error
           }
        }
      }
      return token;
    },

    // session: Add info from JWT token to the session object
    async session({ session, token }) {
      // Add id and role from token to session object
      // Ensure session.user exists before assigning
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },

  session: {
    strategy: 'jwt' // Use JWTs for session management
  },

  secret: process.env.NEXTAUTH_SECRET!, // Secret for signing JWTs

  // Optional: Add debug logging in development
  // debug: process.env.NODE_ENV === 'development',
};
