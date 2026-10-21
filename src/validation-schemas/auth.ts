import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(32, { message: "Username must be at most 32 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers, and underscores are allowed",
    })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password is too long" }),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Please enter your current password" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" })
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" })
    .max(32, { message: "Username must be at most 32 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers, and underscores are allowed",
    })
    .trim(),
});
