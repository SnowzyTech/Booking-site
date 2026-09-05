import { PrismaClient } from "@prisma/client";

/*
 * A single PrismaClient shared across the app. In dev, Next's hot-reload would
 * otherwise create a new client on every change and exhaust the connection
 * pool, so we cache it on globalThis.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
