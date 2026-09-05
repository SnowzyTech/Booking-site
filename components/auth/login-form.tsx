"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";

import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form
      action={action}
      className="rounded-2xl border border-black/5 bg-white/90 p-7 shadow-xl backdrop-blur"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-[#4a4a4a]">
            E-mail
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-[#e6e6e6] bg-white px-3 transition-colors focus-within:border-brand">
            <Mail className="size-4 text-[#9a9a9a]" />
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@…"
              className="h-11 w-full bg-transparent text-[14px] text-[#111] outline-none placeholder:text-[#c4c4c4]"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-[#4a4a4a]">
            Password
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-[#e6e6e6] bg-white px-3 transition-colors focus-within:border-brand">
            <Lock className="size-4 text-[#9a9a9a]" />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-11 w-full bg-transparent text-[14px] text-[#111] outline-none placeholder:text-[#c4c4c4]"
            />
          </span>
        </label>
      </div>

      {state?.error && (
        <p className="mt-3 rounded-md bg-[#fdeaea] px-3 py-2 text-[12px] text-[#a33]">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        variant="solid"
        size="lg"
        disabled={pending}
        className="mt-6 w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
