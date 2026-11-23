import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import dns from "dns";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

let authPool: Pool | null = null;
function getAuthPool(): Pool {
  if (!authPool) {
    authPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return authPool;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, username, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and security cipher are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || cleanEmail.split("@")[0]).toLowerCase().trim();
    const passwordHash = hashPassword(password);
    const pool = getAuthPool();

    if (action === "register") {
      // Check if user already exists
      const existingRes = await pool.query(
        'SELECT id, email, username FROM "User" WHERE email = $1 OR username = $2 LIMIT 1;',
        [cleanEmail, cleanUsername]
      );

      if (existingRes.rows.length > 0) {
        return NextResponse.json(
          { error: "Operator already registered. Switch to SIGN IN to engage interface." },
          { status: 409 }
        );
      }

      const id = "usr_" + Math.random().toString(36).substring(2, 11);
      const insertRes = await pool.query(
        'INSERT INTO "User" ("id", "email", "username", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, email, username, name, role;',
        [id, cleanEmail, cleanUsername, passwordHash, name || cleanUsername, "operator"]
      );

      const created = insertRes.rows[0];
      return NextResponse.json({ user: created });
    } else {
      // Login flow: Check credentials
      const queryRes = await pool.query(
        'SELECT id, email, username, "passwordHash", name, role FROM "User" WHERE email = $1 OR username = $2 LIMIT 1;',
        [cleanEmail, cleanUsername]
      );

      if (queryRes.rows.length === 0) {
        // Auto-provision if initial test operator or prompt to register
        const id = "usr_" + Math.random().toString(36).substring(2, 11);
        const insertRes = await pool.query(
          'INSERT INTO "User" ("id", "email", "username", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, email, username, name, role;',
          [id, cleanEmail, cleanUsername, passwordHash, name || cleanUsername, "operator"]
        );
        return NextResponse.json({ user: insertRes.rows[0] });
      }

      const user = queryRes.rows[0];
      if (user.passwordHash !== passwordHash) {
        return NextResponse.json(
          { error: "Invalid credentials or unauthorized cipher." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      });
    }
  } catch (error: any) {
    console.error("Auth API error:", error?.message || error);
    const detail = error?.message ? `: ${error.message}` : "";
    return NextResponse.json(
      { error: `Database error${detail}. Please check connection or credentials.` },
      { status: 500 }
    );
  }
}
