import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#f3e6fd] via-[#faf3fe] to-[#efe3fb] px-4">
      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-[#c9a3dd]/25 blur-3xl" />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="relative size-16 overflow-hidden rounded-full shadow-md ring-4 ring-white">
            <Image
              src="/images/linda-avatar.jpg"
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <h1 className="mt-4 text-[24px] font-bold tracking-tight text-brand">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-[#6f6f6f]">
            Sign in to manage bookings &amp; appointments
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-[12px] text-[#8a8a8a]">
          <Link href="/" className="transition-colors hover:text-brand">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
