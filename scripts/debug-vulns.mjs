import dotenv from 'dotenv'
import fs from 'node:fs'
import pg from 'pg'
const { Pool } = pg

const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env'
dotenv.config({ path: envPath })

const cfg = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: (/true/i).test(process.env.PGSSL || '') ? { rejectUnauthorized: false } : false,
}
const pool = new Pool(cfg)

const qSites = `
select s.name, count(*) as vulns
from app.vulnerabilities v
join app.sites s on v.site_id = s.id
group by s.name
order by vulns desc
limit 50;
`

const qDates = `
select s.name, min(v.detection_date) as min_date, max(v.detection_date) as max_date, count(*) as vulns
from app.vulnerabilities v
join app.sites s on v.site_id = s.id
group by s.name
order by vulns desc
limit 50;
`

const qSample = `
select v.cve_id, v.endpoint_name, v.base_score, v.detection_date, s.name as site
from app.vulnerabilities v
join app.sites s on v.site_id = s.id
order by v.detection_date desc
limit 20;
`

async function main() {
  const c = await pool.connect()
  try {
    const s = await c.query(qSites)
    console.log('\nTop sites (por número de vulnerabilidades):')
    console.table(s.rows)

    const d = await c.query(qDates)
    console.log('\nRango de fechas por site:')
    console.table(d.rows)

    const sm = await c.query(qSample)
    console.log('\nMuestra de vulnerabilidades:')
    console.table(sm.rows)
  } finally {
    c.release()
    await pool.end()
  }
}
main().catch(e => { console.error(e); process.exit(1) })
