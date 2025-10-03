// api/server.mjs
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'node:fs'
import pg from 'pg'

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env'
dotenv.config({ path: envPath })

const { Pool } = pg
const cfg = {
  host: process.env.PGHOST || '127.0.0.1',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'projects',
  user: process.env.PGUSER || 'svc_projects_ro',
  password: process.env.PGPASSWORD,
  ssl: (/true/i).test(process.env.PGSSL || '') ? { rejectUnauthorized: false } : false,
}

if (!cfg.password) {
  console.error('❌ Falta PGPASSWORD en .env.local')
  process.exit(1)
}

const pool = new Pool(cfg)
const app = express()
app.use(cors())
app.use(express.json())

// --- Queries dadas por el DBA ---
const SQL_TOP_CVE = `
SELECT
  v.cve_id AS name,
  COUNT(DISTINCT v.endpoint_name) AS value
FROM app.vulnerabilities v
JOIN app.sites s ON v.site_id = s.id
WHERE s.name = $1
  AND v.detection_date BETWEEN $2 AND $3
GROUP BY v.cve_id
ORDER BY value DESC, MAX(v.base_score) DESC
LIMIT 10;
`

const SQL_TOP_ASSETS = `
SELECT
  v.endpoint_name AS name,
  COUNT(DISTINCT v.cve_id) AS value
FROM app.vulnerabilities v
JOIN app.sites s ON v.site_id = s.id
WHERE s.name = $1
  AND v.detection_date BETWEEN $2 AND $3
GROUP BY v.endpoint_name
ORDER BY value DESC, MAX(v.base_score) DESC
LIMIT 10;
`

app.get('/api/health', async (_req, res) => {
  try {
    const r = await pool.query('select 1 as ok, now()')
    res.json({ ok: true, ping: r.rows[0] })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
})

/**
 * GET /api/top10?site=PEC&start=2025-07-01&end=2025-09-30
 * Devuelve: { meta, charts: { topCVE, topAssets } }
 */
app.get('/api/top10', async (req, res) => {
  const site = String(req.query.site || '').trim()
  const start = String(req.query.start || '').trim()
  const end = String(req.query.end || '').trim()

  if (!site || !start || !end) {
    return res.status(400).json({ error: 'Faltan parámetros: site, start, end' })
  }

  try {
    const client = await pool.connect()
    try {
      const { rows: topCVE } = await client.query(SQL_TOP_CVE, [site, start, end])
      const { rows: topAssets } = await client.query(SQL_TOP_ASSETS, [site, start, end])

      res.json({
        meta: { site, start, end },
        charts: {
          topCVE: topCVE.map(r => ({ name: r.name, value: Number(r.value) || 0 })),
          topAssets: topAssets.map(r => ({ name: r.name, value: Number(r.value) || 0 })),
        }
      })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'DB error', detail: String(e) })
  }
})

const PORT = process.env.API_PORT || 8787
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
  console.log('DB cfg:', { ...cfg, password: '***' })
})
