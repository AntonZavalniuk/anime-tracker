"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { AuthLogo } from "@/components/auth-logo";
import { FormInput } from "@/components/form-input";
import { login } from "@/actions/auth";
import type { AuthFormState } from "@/actions/auth";
import { LoginSchema } from "@/validation-schemas/auth";

type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const [state, formAction, pending] = useActionState<
    AuthFormState,
    FormData
  >(login, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo subtitle="Sign in to your account" />

        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Global error */}
            {state?.message && !state.errors && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {state.message}
              </div>
            )}

            {/* Email */}
            <FormInput
              id="email"
              type="email"
              label="Email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message ?? state?.errors?.email?.[0]}
              {...register("email")}
            />

            {/* Password */}
            <FormInput
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message ?? state?.errors?.password?.[0]}
              {...register("password")}
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
                <LogIn className="h-4 w-4" />
              )}
              {pending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
