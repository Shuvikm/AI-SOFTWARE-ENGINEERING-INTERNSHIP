const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const { Pool } = require('pg');

async function wipe() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  try {
    const res = await pool.query('DELETE FROM "User";');
    console.log('TABLE EMPTIED:', res.rowCount);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

wipe();
