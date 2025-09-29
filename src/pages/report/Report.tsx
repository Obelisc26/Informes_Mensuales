import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import Page1Overview from "./Page1Overview";
import Page2Analysis from "@/pages/report/Page2Analysis";
import Page3Records from "./Page3Records";
import { exportReportByPages } from "@/utils/pdfExportByPages";

// Fuente de datos actual (la tuya)
import { generateReportData } from "@/data/socData";

/* -------------------- Helpers de normalización -------------------- */

/** Normaliza [{name,value}] a varios nombres comunes que algunos charts podrían esperar */
function withCommonKeysNameValue<T extends { [k: string]: any }>(
  arr: T[],
  nameKey = "name",
  valueKey = "value"
) {
  return (arr ?? []).map((d) => ({
    ...d,
    // claves base
    name: d[nameKey] ?? d.name ?? d.label ?? d.cve ?? d.asset ?? d.tactic,
    value: d[valueKey] ?? d.value ?? d.count,
    // alias frecuentes (por si el chart los usa):
    label: d[nameKey] ?? d.name ?? d.label ?? d.cve ?? d.asset ?? d.tactic,
    count: d[valueKey] ?? d.value ?? d.count,
    cve: d.cve ?? d[nameKey] ?? d.name,
    asset: d.asset ?? d[nameKey] ?? d.name,
    tactic: d.tactic ?? d[nameKey] ?? d.name,
  }));
}

/** Normaliza la serie diaria: acepta {date,...} y añade 'day' como alias */
function normalizeDaily(daily: any[]) {
  return (daily ?? []).map((d) => ({
    ...d,
    day: d.day ?? d.date, // algunos componentes usan 'day'
    date: d.date ?? d.day,
  }));
}

/* ------------------------------------------------------------------ */

export default function Report() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Objeto PLANO que devuelve tu socData.ts
  const raw = generateReportData();

  // Adaptación a la estructura que consumen nuestras páginas
  const data = {
    meta: {
      cliente: "Cliente",
      periodo: "Trimestre en curso",
      autores: ["SOC"],
    },
    kpis: {
      incidentes: raw.incidentsTotal ?? 0,
      activos: raw.activosAffectados ?? 0, // (doble 'f' como en tu código)
      mtta: raw.mtta ?? "-",
      mttr: raw.mttr ?? "-",
    },
    charts: {
      severity: withCommonKeysNameValue(raw.severityData),   // name/value/label/count
      status: withCommonKeysNameValue(raw.statusData),       // name/value/label/count
      daily: normalizeDaily(raw.dailyIncidents),             // date + day
      topCVE: withCommonKeysNameValue(raw.topCVEs),          // cve/name + count/value
      topAssets: withCommonKeysNameValue(raw.topAssets),     // asset/name + count/value
      mitre: withCommonKeysNameValue(raw.mitreData),         // tactic/name + value/count
    },
    analisis: {
      ttpNotes: [],                           // añade textos si quieres
      cveDetails: raw.cveDetails ?? [],
    },
    incidents: raw.sampleIncidents ?? [],
    content: {
      events: raw.highlightedEvents ?? [],
      recommendations: raw.recommendations ?? [],
      glossary: raw.glossary ?? [],
    },
  };

  const handleExport = async () => {
    if (!rootRef.current) return;
    await exportReportByPages(rootRef.current, {
      filename: `informe-soc-${data.meta.periodo}.pdf`,
    });
  };

  return (
    <div ref={rootRef} className="space-y-4">
      {/* Acciones */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handleExport}>Exportar PDF</Button>
      </div>

      {/* Página 1 */}
      <Page1Overview
        cliente={data.meta.cliente}
        periodo={data.meta.periodo}
        autores={data.meta.autores}
        kpis={data.kpis}
        charts={{
          severity: data.charts.severity,
          status: data.charts.status,
          daily: data.charts.daily,
        }}
      />

      {/* Página 2 */}
      <Page2Analysis
        charts={{
          topCVE: data.charts.topCVE,
          topAssets: data.charts.topAssets,
          mitre: data.charts.mitre,
        }}
        ttpNotes={data.analisis.ttpNotes}
        cveDetails={data.analisis.cveDetails}
      />

      {/* Página 3 */}
      <Page3Records
        incidents={data.incidents}
        events={data.content.events}
        recommendations={data.content.recommendations}
        glossary={data.content.glossary}
      />
    </div>
  );
}
