/**
 * lib/prisma.ts — Prisma Client singleton
 *
 * Branches on DATABASE_URL:
 *   - "prisma+postgres://" → Prisma Accelerate (requires @prisma/extension-accelerate)
 *   - anything else        → direct @prisma/adapter-pg connection
 *
 * The client is cached on globalThis in development so hot-module reloads
 * do not open extra connections.
 */

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL ?? "";

function createPrismaClient(): PrismaClient {
  if (url.startsWith("prisma+postgres://")) {
    // Accelerate path — requires: npm install @prisma/extension-accelerate
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { withAccelerate } = require("@prisma/extension-accelerate") as {
      withAccelerate: () => Parameters<PrismaClient["$extends"]>[0];
    };
    return new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  }

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
