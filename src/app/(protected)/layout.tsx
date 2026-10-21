import { Suspense } from "react";
import { verifySession } from "@/lib/dal";
import { Navbar, NavbarFallback } from "@/components/navbar";

const SessionGate = async () => {
  await verifySession();
  return null;
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans selection:bg-indigo-500/20 selection:text-indigo-500">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>

      <Suspense fallback={null}>
        <SessionGate />
        {children}
      </Suspense>
    </div>
  );
}
