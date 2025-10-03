// scripts/fetch-top10.mjs
import fs from 'node:fs'
import dotenv from 'dotenv'
import pg from 'pg'                    // ⬅️ IMPORTA pg
const { Pool } = pg

// Carga .env.local (o .env si no existe)
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env'
dotenv.config({ path: envPath })
console.log(`[env] loaded ${envPath}, have PGPASSWORD?`, typeof process.env.PGPASSWORD === 'string')

// Helpers
const must = (k) => {
  const v = process.env[k]
  if (!v || typeof v !== 'string') throw new Error(`Falta ${k} en ${envPath} (o no es string)`)
  return v
}

// Config conexión PG
const cfg = {
  host: must('PGHOST'),
  port: Number(must('PGPORT')),
  database: must('PGDATABASE'),
  user: must('PGUSER'),
  password: must('PGPASSWORD'),
  ssl: (/true/i).test(process.env.PGSSL || '') ? { rejectUnauthorized: false } : false,
}
console.log('Conectando con:', { ...cfg, password: '***' })

const pool = new Pool(cfg)

// Parámetros de consulta
const SITE  = process.env.SITE  ?? 'LUXPACK'
const START = process.env.START ?? '2025-07-01'
const END   = process.env.END   ?? '2025-09-30'

// Queries (las que te pasaron)
const qTopCVE = `
SELECT
    v.cve_id AS name,
    COUNT(DISTINCT v.endpoint_name) AS value
FROM app.vulnerabilities v
JOIN app.sites s ON v.site_id = s.id
WHERE s.name = $1
AND v.detection_date BETWEEN $2 AND $3
GROUP BY v.cve_id
ORDER BY value DESC, MAX(v.base_score) DESC
LIMIT 10;`

const qTopAssets = `
SELECT
    v.endpoint_name AS name,
    COUNT(DISTINCT v.cve_id) AS value
FROM app.vulnerabilities v
JOIN app.sites s ON v.site_id = s.id
WHERE s.name = $1
AND v.detection_date BETWEEN $2 AND $3
GROUP BY v.endpoint_name
ORDER BY value DESC, MAX(v.base_score) DESC
LIMIT 10;`

async function main () {
  const client = await pool.connect()
  try {
    const ping = await client.query('select 1 as ok, now()')
    console.log('Ping ->', ping.rows[0])

    const { rows: topCVE }    = await client.query(qTopCVE,   [SITE, START, END])
    const { rows: topAssets } = await client.query(qTopAssets,[SITE, START, END])

    console.log('\nTop 10 CVE')
    console.table(topCVE)

    console.log('\nTop 10 Assets')
    console.table(topAssets)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
