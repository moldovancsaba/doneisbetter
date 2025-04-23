import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db'; // Use alias for lib
import { getUserModel } from '@/lib/models/User'; // Use alias for lib/models

/**
 * Configuration options for NextAuth.js
 */
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add the user ID (Google ID from token.sub) to the session
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // The user object is available only on initial sign-in
      if (user) {
        token.id = user.id; // Store provider ID in the JWT token
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      // Check if the sign-in is via Google and profile details are available
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectToDatabase();
          const UserModel = await getUserModel();
          
          // Use the Google ID (user.id from provider) to find or create the user
          const googleId = user.id; 
          let dbUser = await UserModel.findOne({ googleId: googleId });
          
          if (!dbUser) {
            // Create a new user if they don't exist in the database
            console.log(`Creating new user: ${profile.email}`);
            dbUser = await UserModel.create({
              googleId: googleId,
              email: profile.email,
              name: profile.name || profile.email, // Use email as name if name is not provided
              image: (profile as any)?.picture || undefined // Access picture safely
            });
          } else {
            console.log(`User already exists: ${profile.email}`);
          }
          
          return true; // Allow sign-in
        } catch (error) {
          console.error('Error during signIn database operation:', error);
          // Return false to prevent sign-in if there's a database error
          return false; 
        }
      }
      // Deny sign-in if it's not Google or profile email is missing
      return false; 
    }
  },
  pages: {
    // Optional: Define custom pages if you have them
    // signIn: '/auth/signin',
    // error: '/auth/error', 
  },
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

