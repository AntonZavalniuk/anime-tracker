import { Suspense } from "react";
import { verifySession } from "@/lib/dal";

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
    <Suspense fallback={null}>
      <SessionGate />
      {children}
    </Suspense>
  );
}
