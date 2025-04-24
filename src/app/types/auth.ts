import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession['user']
  }

  /**
   * Extends the built-in user types.
   */
  interface User {
    id: string;
    role: 'user' | 'admin';
    googleId?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT type
   */
  interface JWT {
    id: string;
    role: 'user' | 'admin';
    googleId?: string;
    sub?: string;
  }
}
