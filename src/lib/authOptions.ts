import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db';
import { getUserModel, UserDocument } from '@/lib/models/User'; // Import UserDocument

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
    // This one is correct
    async session({ session, token }) {
      // Assign the MongoDB User ID from the token to the session
      if (session?.user && token?.dbUserId) {
        session.user.id = token.dbUserId as string; // Use dbUserId from JWT
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // On successful sign-in (account is available), find the DB user and add their MongoDB _id to the token
      if (account && user) {
        try {
          await connectToDatabase();
          const UserModel = await getUserModel(); // Keep only one declaration
          // Find the user based on Google ID (user.id from provider === token.sub)
          const dbUser: UserDocument | null = await UserModel.findOne({ googleId: token.sub }); // Add type annotation
          
          if (dbUser) { // Correct if/else structure
            // Explicitly check if _id exists and is usable before assigning
            if (dbUser._id && typeof dbUser._id.toString === 'function') {
              token.dbUserId = dbUser._id.toString();
            } else {
              console.error(`Found DB user for token sub: ${token.sub}, but _id is missing or invalid.`);
              // Decide how to handle this - maybe don't add dbUserId to token
            }
          } else {
             console.warn(`Could not find DB user for token sub: ${token.sub}`);
          }
        } catch (error) {
          console.error("Error fetching DB user ID for JWT:", error);
          // Don't add dbUserId if there's an error
        }
      }
      return token;
    }, // <<< Add closing brace and comma here
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
          // Ensure dbUser is found or created before allowing sign-in
          if (!dbUser?._id) {
            console.error("Failed to find or create user's MongoDB document during signIn.");
            return false; // Prevent sign-in if DB user ID is missing
          }
          return true; // Allow sign-in
        } catch (error) {
           console.error('Error during signIn database operation:', error);
           return false; // Prevent sign-in on error
        }
      }
      // Deny sign-in if it's not Google or profile email is missing
      return false; 
    } // <<< End of signIn function
  }, // <<< End of callbacks object
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

