"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { AuthLogo } from "@/components/auth-logo";
import { FormInput } from "@/components/form-input";
import { register as registerAction } from "@/actions/auth";
import type { AuthFormState } from "@/actions/auth";
import { NAVIGATION_LINKS } from "@/constants";
import { RegisterSchema } from "@/validation-schemas/auth";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const [state, formAction, pending] = useActionState<
    AuthFormState,
    FormData
  >(registerAction, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo subtitle="Create an account" />

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

            {/* Username */}
            <FormInput
              id="username"
              type="text"
              label="Username"
              icon={User}
              autoComplete="username"
              placeholder="zephyrus"
              error={errors.username?.message ?? state?.errors?.username?.[0]}
              {...register("username")}
            />

            {/* Password */}
            <FormInput
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              autoComplete="new-password"
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
