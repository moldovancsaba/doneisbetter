import NextAuth from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";

const handler = NextAuth({
  providers: [
    {
      id: "doneisbetter-sso",
      name: "Done is Better SSO",
      type: "oauth",
      authorization: {
        url: "https://sso.doneisbetter.com/api/auth/custom-authorize",
        params: { scope: "openid profile email" }
      },
      token: "https://sso.doneisbetter.com/api/oauth/token",
      userinfo: "https://sso.doneisbetter.com/api/auth/validate",
      clientId: process.env.DIB_SSO_CLIENT_ID!,
      clientSecret: process.env.DIB_SSO_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: profile.role
        };
      },
    } as OAuthConfig<any>,
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Forward the SSO token and profile data
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userRole = profile?.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the access token and role to the session
      session.accessToken = token.accessToken;
      session.userRole = token.userRole;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
