import { timingSafeEqual } from "node:crypto";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/*
 * Auth.js — a single shared admin account, credentials from the environment
 * (ADMIN_EMAIL / ADMIN_PASSWORD). JWT sessions, so no DB session table needed.
 * The admin routes are guarded three ways: proxy.ts (optimistic redirect), the
 * admin layout/pages (secure `auth()` check), and every admin server action.
 */

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare lengths first; timingSafeEqual throws on length mismatch.
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD ?? "";

        if (!adminEmail || !adminPassword) return null;
        if (
          email === adminEmail &&
          password.length > 0 &&
          safeEqual(password, adminPassword)
        ) {
          return { id: "admin", email: adminEmail, name: "Admin", role: "ADMIN" };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // Optimistic gate used by proxy.ts.
    authorized: ({ auth, request }) => {
      const path = request.nextUrl.pathname;
      const onAdminRoute =
        path.startsWith(ADMIN_PREFIX) &&
        !PUBLIC_ADMIN_PATHS.some((p) => path.startsWith(p));
      if (onAdminRoute) return Boolean(auth?.user);
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as
          | string
          | undefined;
      }
      return session;
    },
  },
});
