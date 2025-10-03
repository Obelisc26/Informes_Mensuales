// scripts/server/db.mjs
import pg from 'pg';
import dotenv from 'dotenv';

// Carga variables de .env.local
dotenv.config({ path: '.env.local' });

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: String(process.env.PGSSL).toLowerCase() === 'true'
    ? { rejectUnauthorized: false }
    : false,
});

export async function q(text, params = []) {
  const c = await pool.connect();
  try {
    const r = await c.query(text, params);
    return r.rows;
  } finally {
    c.release();
  }
}

export async function listSites() {
  return q(`select name from app.sites order by name`);
}

// ---------- Fechas ----------

// YYYY-MM-DD en zona local
function ymdLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Se calcula en cada request:
 *   START = hoy - 3 meses (00:00 local)
 *   END   = hoy (00:00 local)
 */
export function defaultDatesRuntime() {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setMonth(start.getMonth() - 3);

  return {
    start: ymdLocal(start),
    end: ymdLocal(end),
  };
}
