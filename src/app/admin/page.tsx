import { Suspense } from 'react';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import UserTable from '@/components/admin/UserTable';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="border rounded-lg p-4 bg-card text-card-foreground shadow-sm">
        <Suspense fallback={<div>Loading user data...</div>}>
          <UserTable />
        </Suspense>
      </div>
    </div>
  );
}
