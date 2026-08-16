/**
 * lib/prisma.ts — Prisma Client singleton
 *
 * Uses @prisma/adapter-pg (direct TCP connection) as the driver adapter.
 * The client is cached on globalThis in development so hot-module reloads
 * do not open extra connections.
 */

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL ?? "";

function createPrismaClient(): PrismaClient {
  // Direct pg adapter path — PrismaPg accepts a connection string directly
  const adapter = new PrismaPg(url);
  return new PrismaClient({ adapter });
}

declare const globalThis: {
  prismaGlobal?: PrismaClient;
} & typeof global;

const prisma: PrismaClient =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
