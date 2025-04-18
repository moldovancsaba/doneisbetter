'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function LogoutButton() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <a href="/api/auth/logout" className="btn btn-secondary">
      Log Out
    </a>
  );
}

