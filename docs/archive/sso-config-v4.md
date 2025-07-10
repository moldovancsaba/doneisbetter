# Archived SSO Configuration (v4.x)

This document archives the SSO configuration that was removed in v5.0.0 for historical reference.

## Authentication System

The SSO authentication system was implemented using next-auth with OAuth2.0 providers. This configuration was in place from versions 1.0.0 through 4.2.3.

### Core Components

1. NextAuth Configuration
- Located in: `src/app/api/auth/[...nextauth]/route.ts`
- Implemented OAuth2.0 flow
- MongoDB adapter for session storage

2. Authentication Types
- Located in: `src/types/next-auth.d.ts`
- Extended NextAuth types for TypeScript support

3. Protected Routes
- Located in: `src/lib/withAuth.tsx`
- HOC for route protection
- Session validation middleware

4. Auth Pages
- Sign In: `src/app/auth/signin/page.tsx`
- Error Handling: `src/app/auth/error/page.tsx`

### Environmental Configuration

The following environment variables were required:

```env
NEXTAUTH_URL=https://example.com
NEXTAUTH_SECRET=your-secret-key
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
```

### Removal Rationale

The SSO system was removed in v5.0.0 to:
1. Simplify the overall architecture
2. Remove unnecessary complexity
3. Improve maintainability
4. Reduce dependency overhead

This document was archived on 2025-07-07T11:00:00.000Z as part of the v5.0.0 release.
