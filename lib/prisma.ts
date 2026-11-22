import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

export function getPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const pool =
      globalForPrisma.pool ??
      new Pool({
        connectionString,
        max: 5,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 3000, // Faster failover to instant fallback when Neon sleeps
      });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
      globalForPrisma.pool = pool;
    }

    return prisma;
  } catch (error) {
    console.warn("Failed to initialize Prisma adapter:", error);
    return null;
  }
}

export const prisma = getPrismaClient();
