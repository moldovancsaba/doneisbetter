'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButton() {
  const { user } = useUser();

  if (user) return null;

  return (
    <a href="/api/auth/login" className="btn btn-primary">
      Log In
    </a>
  );
}

