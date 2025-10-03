import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Page1Overview from "./Page1Overview";
import Page2Analysis from "@/pages/report/Page2Analysis";
import Page3Records from "./Page3Records";
import { exportReportByPages } from "@/utils/pdfExportByPages";

// ✅ tus datos locales (los de siempre)
import { generateReportData } from "@/data/socData";

// helpers para adaptar las claves a name/value
function withCommonKeys<T extends Record<string, any>>(
  arr: T[],
  nameKey = "name",
  valueKey = "value"
) {
  return (arr ?? []).map((d) => ({
    ...d,
    name: d[nameKey] ?? d.name ?? d.label ?? d.cve ?? d.asset ?? d.tactic,
    value: d[valueKey] ?? d.value ?? d.count,
    label: d[nameKey] ?? d.name ?? d.label ?? d.cve ?? d.asset ?? d.tactic,
    count: d[valueKey] ?? d.value ?? d.count,
  }));
}

const fmtES = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

type Top10Resp = {
  ok?: boolean;
  meta?: { site: string; start: string; end: string };
  charts?: {
    topCVE: { name: string; value: number }[];
    topAssets: { name: string; value: number }[];
  };
};

type TopItem = { name: string; value: number };
type ApiTop10 = {
  meta: { site: string; start: string; end: string };
  charts: { topCVE: TopItem[]; topAssets: TopItem[] };
};

const fetchTop10 = async (site: string) => {
  const res = await fetch(`/api/top10?site=${encodeURIComponent(site)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as ApiTop10;

  // Fuente única: lo que viene del server ya está {name, value}
  setTopCVE(data.charts.topCVE);
  setTopAssets(data.charts.topAssets);
  setHeader({
    cliente: data.meta.site,
    periodo: `${fmt(data.meta.start)} – ${fmt(data.meta.end)}`,
  });
};

export default function Report() {
  const rootRef = useRef<HTMLDivElement>(null);

  // 1) Datos locales base (Pág.1 y resto)
  const raw = useMemo(() => generateReportData(), []);
  const base = useMemo(() => {
    return {
      meta: {
        cliente: "Cliente",
        periodo: "—",
        autores: ["SOC"],
      },
      kpis: {
        incidentes: raw.incidentsTotal ?? 0,
        activos: raw.activosAffectados ?? 0,
        mtta: raw.mtta ?? "-",
        mttr: raw.mttr ?? "-",
      },
      charts: {
        severity: withCommonKeys(raw.severityData),
        status: withCommonKeys(raw.statusData),
        daily: (raw.dailyIncidents ?? []).map((d: any) => ({
          ...d,
          day: d.day ?? d.date,
          date: d.date ?? d.day,
        })),
        // por si necesitas fallback local
        topCVE: withCommonKeys(raw.topCVEs ?? []),
        topAssets: withCommonKeys(raw.topAssets ?? []),
        mitre: withCommonKeys(raw.mitreData ?? []),
      },
      analisis: {
        ttpNotes: [],
        cveDetails: raw.cveDetails ?? [],
      },
      incidents: raw.sampleIncidents ?? [],
      content: {
        events: raw.highlightedEvents ?? [],
        recommendations: raw.recommendations ?? [],
        glossary: raw.glossary ?? [],
      },
    };
  }, [raw]);

  // 2) Cliente/período desde la API + topCVE/topAssets reales (Pág.2)
  const [cliente, setCliente] = useState<string>(base.meta.cliente);
  const [periodo, setPeriodo] = useState<string>(base.meta.periodo);

  const [topCVE, setTopCVE] = useState<{ name: string; value: number }[]>(
    base.charts.topCVE
  );
  const [topAssets, setTopAssets] = useState<{ name: string; value: number }[]>(
    base.charts.topAssets
  );

  const site = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get("site") ?? "PEC";
  }, []);

  useEffect(() => {
    fetch(`/api/top10?site=${encodeURIComponent(site)}`)
      .then((r) => r.json())
      .then((j: Top10Resp) => {
        if (j?.meta?.site) {
          setCliente(j.meta.site);
          setPeriodo(`${fmtES(j.meta.start)} – ${fmtES(j.meta.end)}`);
        } else {
          // fallback: 3 meses hasta hoy
          const today = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 3);
          setCliente(site);
          setPeriodo(
            `${fmtES(start.toISOString().slice(0, 10))} – ${fmtES(
              today.toISOString().slice(0, 10)
            )}`
          );
        }

        if (j?.charts?.topCVE) setTopCVE(withCommonKeys(j.charts.topCVE));
        if (j?.charts?.topAssets)
          setTopAssets(withCommonKeys(j.charts.topAssets));
      })
      .catch(() => {
        // si falla la API, quedamos con los locales
        setCliente(site);
        const today = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 3);
        setPeriodo(
          `${fmtES(start.toISOString().slice(0, 10))} – ${fmtES(
            today.toISOString().slice(0, 10)
          )}`
        );
      });
  }, [site]);

  const handleExport = async () => {
    if (!rootRef.current) return;
    await exportReportByPages(rootRef.current, {
      filename: `informe-soc-${cliente}-${periodo}.pdf`,
    });
  };

  return (
    <div ref={rootRef} className="space-y-4">
      {/* Botón export */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handleExport}>Exportar PDF</Button>
      </div>

      {/* PÁGINA 1 — usa datos locales (hay datos) */}
      <Page1Overview
        cliente={cliente}
        periodo={periodo}
        autores={base.meta.autores}
        kpis={base.kpis}
        charts={{
          severity: base.charts.severity,
          status: base.charts.status,
          daily: base.charts.daily,
        }}
      />

      {/* PÁGINA 2 — topCVE/topAssets desde API (fallback a locales) */}
      <Page2Analysis
        charts={{
          topCVE: topCVE?.length ? topCVE : base.charts.topCVE,
          topAssets: topAssets?.length ? topAssets : base.charts.topAssets,
          mitre: base.charts.mitre,
        }}
        ttpNotes={base.analisis.ttpNotes}
        cveDetails={base.analisis.cveDetails}
      />

      {/* PÁGINA 3 — igual que antes */}
      <Page3Records
        incidents={base.incidents}
        events={base.content.events}
        recommendations={base.content.recommendations}
        glossary={base.content.glossary}
      />
    </div>
  );
}
