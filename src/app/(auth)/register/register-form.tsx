"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { AuthLogo } from "@/components/auth-logo";
import { FormInput } from "@/components/form-input";
import { register } from "@/actions/auth";
import type { AuthFormState } from "@/actions/auth";
import { NAVIGATION_LINKS } from "@/constants";

export const RegisterForm = () => {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    register,
    undefined,
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo subtitle="Create an account" />

        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <form action={action} className="space-y-5">
            {/* Global error */}
            {state?.message && !state.errors && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {state.message}
              </div>
            )}

            {/* Email */}
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              error={state?.errors?.email?.[0]}
            />

            {/* Username */}
            <FormInput
              id="username"
              name="username"
              type="text"
              label="Username"
              icon={User}
              autoComplete="username"
              placeholder="zephyrus"
              error={state?.errors?.username?.[0]}
            />

            {/* Password */}
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={state?.errors?.password?.[0]}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {pending ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={NAVIGATION_LINKS.login}
                className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
