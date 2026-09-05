// Next 16 middleware is called "proxy". Auth.js's `auth` doubles as the handler:
// it runs the `authorized` callback and redirects to /login on protected routes.
// This is only the optimistic gate — the secure checks live in the admin layout,
// pages, and every admin server action.
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
