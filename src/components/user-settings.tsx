"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { updateUsername, updatePassword } from "@/actions/auth";
import type { AuthFormState } from "@/actions/auth";
import { FormInput } from "@/components/form-input";
import { NAVIGATION_LINKS } from "@/constants";
import type { SessionUser } from "@/lib/dal";

type UserSettingsProps = {
  user: SessionUser;
};

const SuccessMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
};

export const UserSettings = ({ user }: UserSettingsProps) => {
  const [usernameState, usernameAction, usernamePending] = useActionState<
    AuthFormState,
    FormData
  >(updateUsername, undefined);

  const [passwordState, passwordAction, passwordPending] = useActionState<
    AuthFormState,
    FormData
  >(updatePassword, undefined);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={NAVIGATION_LINKS.home}
        className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to list
      </Link>

      <h1 className="mb-2 text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Manage profile:{" "}
        <span className="font-medium text-foreground">{user.email}</span>
      </p>

      <div className="space-y-6">
        {/* ── Username ── */}
        <div className="rounded-2xl border border-border/50 bg-card/60 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <User className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Username</h2>
              <p className="text-xs text-muted-foreground">
                Current: @{user.username}
              </p>
            </div>
          </div>

          <form action={usernameAction} className="space-y-4">
            <FormInput
              id="username"
              name="username"
              type="text"
              label="New username"
              icon={User}
              defaultValue={user.username}
              placeholder={user.username}
              error={usernameState?.errors?.username?.[0]}
            />

            {usernameState?.message?.startsWith("✅") ? (
              <SuccessMessage message={usernameState.message} />
            ) : (
              usernameState?.message && (
                <p className="text-xs text-destructive">
                  {usernameState.message}
                </p>
              )
            )}

            <button
              type="submit"
              disabled={usernamePending}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {usernamePending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {usernamePending ? "Saving..." : "Save username"}
            </button>
          </form>
        </div>

        {/* ── Password ── */}
        <div className="rounded-2xl border border-border/50 bg-card/60 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <Lock className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Change Password</h2>
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters
              </p>
            </div>
          </div>

          <form action={passwordAction} className="space-y-4">
            <FormInput
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current password"
              icon={Lock}
              autoComplete="current-password"
              placeholder="••••••••"
              error={passwordState?.errors?.currentPassword?.[0]}
            />

            <FormInput
              id="newPassword"
              name="newPassword"
              type="password"
              label="New password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={passwordState?.errors?.newPassword?.[0]}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm new password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={passwordState?.errors?.confirmPassword?.[0]}
            />

            {passwordState?.message?.startsWith("✅") ? (
              <SuccessMessage message={passwordState.message} />
            ) : (
              passwordState?.message && (
                <p className="text-xs text-destructive">
                  {passwordState.message}
                </p>
              )
            )}

            <button
              type="submit"
              disabled={passwordPending}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/35 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {passwordPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {passwordPending ? "Saving..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
