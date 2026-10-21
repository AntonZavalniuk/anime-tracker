import { Suspense } from "react";
import { redirectIfAuthenticated } from "@/lib/dal";
import { LoginForm } from "./login-form";

const AuthCheck = async () => {
  await redirectIfAuthenticated();
  return null;
};

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
