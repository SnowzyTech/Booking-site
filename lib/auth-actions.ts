"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/appointments",
    });
    return undefined;
  } catch (error) {
    // A successful sign-in throws a NEXT_REDIRECT that must propagate.
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
