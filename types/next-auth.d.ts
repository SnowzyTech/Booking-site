import type { DefaultSession } from "next-auth";

// Add `role` to the session user and the JWT.
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: { role?: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
