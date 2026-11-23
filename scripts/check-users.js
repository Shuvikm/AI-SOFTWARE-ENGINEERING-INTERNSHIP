const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const { Pool } = require('pg');

async function check() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  try {
    const res = await pool.query('SELECT id, email, username, name, "passwordHash", role FROM "User";');
    console.log('OPERATORS FOUND:', JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('QUERY ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

check();
