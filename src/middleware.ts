import { withAuth } from '@auth0/nextjs-auth0';

export default withAuth();

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
};

