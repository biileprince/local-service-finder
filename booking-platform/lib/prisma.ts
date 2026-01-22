import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Get absolute database path
// In production (Vercel), use /tmp which is writable
// In development, use local prisma folder
const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction
  ? "/tmp/dev.db"
  : path.resolve(process.cwd(), "prisma", "dev.db");

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (!isProduction) globalForPrisma.prisma = prisma;

export default prisma;
