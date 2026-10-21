import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { UserSettings } from "@/components/user-settings";

export const metadata: Metadata = {
  title: "Settings — AniTracker",
  description: "Manage your profile: change username and password",
};

const UserSettingsData = async () => {
  const user = await getCurrentUser();
  // The layout already redirects unauthenticated requests; a null user here
  // means the account was deleted while the session cookie was still valid.
  if (!user) notFound();

  return <UserSettings user={user} />;
};

export default function SettingsPage() {
  return (
    <div className="relative flex-1 overflow-x-clip bg-transparent">
      <Suspense fallback={null}>
        <UserSettingsData />
      </Suspense>
    </div>
  );
}
