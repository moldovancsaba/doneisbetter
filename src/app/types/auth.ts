import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include the user's ID.
   */
  interface Session {
    user: {
      /** The user's unique identifier (usually Google ID in this setup) */
      id: string;
      /** The user's email address */
      email: string;
      /** The user's name */
      name: string;
      /** The URL of the user's profile image */
      image?: string;
    }
  }
  
  // You can also extend the User type if needed, for example, to include the MongoDB _id
  // interface User {
  //   _id?: string; // Optional MongoDB _id
  // }
}

declare module 'next-auth/jwt' {
  /** Extends the built-in JWT type */
  interface JWT {
    /** This is the user ID (Google ID) */
    id?: string;
  }
}

