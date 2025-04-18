import { UserProfile, LoginButton, LogoutButton } from '@/components/auth';

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <UserProfile />
          <LoginButton />
          <LogoutButton />
        </div>
      </nav>
      <section>
        {/* Main dashboard content will go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
          <p>This content is protected and only visible to authenticated users.</p>
        </div>
      </section>
    </main>
  );
}

