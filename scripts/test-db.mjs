// scripts/test-db.mjs
import dotenv from 'dotenv';

// 1) Intenta .env.local primero
const resLocal = dotenv.config({ path: '.env.local' });
// 2) Si .env.local no existe o no cargó, intenta .env
if (resLocal.error) {
  dotenv.config(); // busca .env
}
import pkg from 'pg';
const { Client } = pkg;

// --- saneamos/forzamos strings ---
const env = (k, def = '') => {
  const v = process.env[k];
  return typeof v === 'string' ? v.trim() : def;
};

const host = env('PGHOST', '127.0.0.1');
const port = Number(env('PGPORT', '5432'));
const database = env('PGDATABASE', 'projects');
const user = env('PGUSER', 'svc_projects');
const password = env('PGPASSWORD', '');

// si no hay password válido, detenemos aquí con mensaje claro
if (!password) {
  console.error('❌ Falta PGPASSWORD en .env.local (o está vacío).');
  process.exit(1);
}

const ssl = env('PGSSL', 'false').toLowerCase() === 'true'
  ? { rejectUnauthorized: false }
  : false;

const cfg = { host, port, database, user, password: String(password), ssl };

async function main() {
  const client = new Client(cfg);

  console.log('Intentando conectar a PostgreSQL con:');
  const safeCfg = { ...cfg, password: '***' };
  console.log(safeCfg);

  try {
    await client.connect();
    console.log('✅ Conexión OK');

    const ping = await client.query('SELECT 1 as ok, now();');
    console.log('Ping ->', ping.rows[0]);

    const tables = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name
      LIMIT 10;
    `);
    console.log('Tablas (primeras 10):');
    for (const t of tables.rows) {
      console.log(` - ${t.table_schema}.${t.table_name}`);
    }
  } catch (err) {
    console.error('❌ Error conectando/consultando:', err.message);
    process.exitCode = 1;
  } finally {
    try { await client.end(); } catch {}
  }
}

main();
