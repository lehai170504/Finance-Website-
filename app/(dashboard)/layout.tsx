import { Header } from "@/components/layouts/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
        {children}
      </main>
    </>
  );
}
