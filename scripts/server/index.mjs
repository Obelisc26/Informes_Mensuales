// scripts/server/index.mjs
import express from 'express';
import cors from 'cors';
import { q, listSites, defaultDatesRuntime } from './db.mjs';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const ping = await q('select 1 as ok, now()');
  res.json({ ok: true, ping: { ok: ping[0].ok, now: ping[0].now } });
});

app.get('/api/sites', async (_req, res) => {
  const rows = await listSites();
  res.json({ sites: rows.map(r => r.name) });
});

app.get('/api/top10', async (req, res) => {
  try {
    let { site, start, end } = req.query ?? {};
    if (!site) return res.status(400).json({ error: 'Falta parámetro: site' });

    // Si no envían fechas, calculamos START = hoy-3m, END = hoy
    if (!start || !end) {
      const d = defaultDatesRuntime();
      start = start ?? d.start;
      end   = end   ?? d.end;
    }

    const sqlTopCVE = `
      SELECT v.cve_id AS name, COUNT(DISTINCT v.endpoint_name)::int AS value
      FROM app.vulnerabilities v
      JOIN app.sites s ON v.site_id = s.id
      WHERE s.name = $1
        AND v.detection_date >= $2::date
        AND v.detection_date < ($3::date + interval '1 day')
      GROUP BY v.cve_id
      ORDER BY value DESC, MAX(v.base_score) DESC
      LIMIT 10;
    `;

    const sqlTopAssets = `
      SELECT v.endpoint_name AS name, COUNT(DISTINCT v.cve_id)::int AS value
      FROM app.vulnerabilities v
      JOIN app.sites s ON v.site_id = s.id
      WHERE s.name = $1
        AND v.detection_date >= $2::date
        AND v.detection_date < ($3::date + interval '1 day')
      GROUP BY v.endpoint_name
      ORDER BY value DESC, MAX(v.base_score) DESC
      LIMIT 10;
    `;

    const [rowsCve, rowsAssets] = await Promise.all([
      q(sqlTopCVE, [site, start, end]),
      q(sqlTopAssets, [site, start, end]),
    ]);

    const toPairs = (rows) =>
      rows
        .map(r => ({
          name: String(r.name ?? r.cve_id ?? r.endpoint_name ?? '').trim(),
          value: Number(r.value ?? r.count ?? r.total ?? 0),
        }))
        .filter(x => x.name && Number.isFinite(x.value));

    res.json({
      meta: { site, start, end },
      charts: {
        topCVE: toPairs(rowsCve),
        topAssets: toPairs(rowsAssets),
      },
    });
  } catch (err) {
    console.error('GET /api/top10 error:', err);
    res.status(500).json({ error: 'server_error', details: String(err) });
  }
});

const port = Number(process.env.API_PORT || 8787);
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
