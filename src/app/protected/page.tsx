import { withAuth } from '@/lib/withAuth';
import { useSession } from 'next-auth/react';

function ProtectedPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome {session?.user?.name}</p>
      <p>Your role: {session?.userRole}</p>
    </div>
  );
}

export default withAuth(ProtectedPage);
