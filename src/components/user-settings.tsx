"use client";

import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { User, Lock, Save, Loader2, CheckCircle2 } from "lucide-react";
import { updateUsername, updatePassword } from "@/actions/auth";
import type { AuthFormState } from "@/actions/auth";
import { FormInput } from "@/components/form-input";
import type { SessionUser } from "@/lib/dal";
import {
  UpdateUsernameSchema,
  UpdatePasswordSchema,
} from "@/validation-schemas/auth";

type UpdateUsernameFormValues = z.infer<typeof UpdateUsernameSchema>;
type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordSchema>;

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

  const usernameForm = useForm<UpdateUsernameFormValues>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: { username: user.username },
  });

  const onUsernameSubmit = usernameForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    startTransition(() => usernameAction(formData));
  });

  const passwordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = passwordForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("currentPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmPassword", data.confirmPassword);
    startTransition(() => passwordAction(formData));
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* ── Username ── */}
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
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
            <span className="text-xs font-medium text-muted-foreground">
              {user.email}
            </span>
          </div>

          <form onSubmit={onUsernameSubmit} className="space-y-4" noValidate>
            <FormInput
              id="username"
              type="text"
              label="New username"
              icon={User}
              placeholder={user.username}
              error={
                usernameForm.formState.errors.username?.message ??
                usernameState?.errors?.username?.[0]
              }
              {...usernameForm.register("username")}
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
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
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

          <form onSubmit={onPasswordSubmit} className="space-y-4" noValidate>
            <FormInput
              id="currentPassword"
              type="password"
              label="Current password"
              icon={Lock}
              autoComplete="current-password"
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.currentPassword?.message ??
                passwordState?.errors?.currentPassword?.[0]
              }
              {...passwordForm.register("currentPassword")}
            />

            <FormInput
              id="newPassword"
              type="password"
              label="New password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.newPassword?.message ??
                passwordState?.errors?.newPassword?.[0]
              }
              {...passwordForm.register("newPassword")}
            />

            <FormInput
              id="confirmPassword"
              type="password"
              label="Confirm new password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={
                passwordForm.formState.errors.confirmPassword?.message ??
                passwordState?.errors?.confirmPassword?.[0]
              }
              {...passwordForm.register("confirmPassword")}
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
