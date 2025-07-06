export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <main>{children}</main>
      </div>
    </div>
  );
}
