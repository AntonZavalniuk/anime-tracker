import { Suspense } from "react";
import { AuthCheck } from "@/lib/dal";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      <LoginForm />
    </>
  );
}
