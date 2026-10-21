import { Suspense } from "react";
import { AuthCheck } from "@/lib/dal";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>
      <RegisterForm />
    </>
  );
}
