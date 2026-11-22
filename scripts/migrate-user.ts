import "dotenv/config";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "username" TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "name" TEXT,
        "role" TEXT NOT NULL DEFAULT 'operator',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
    `;
    await pool.query(createTableSql);
    console.log("User table migrated successfully in Neon PostgreSQL!");

    const check = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User';`
    );
    console.log("User table columns:", check.rows);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
