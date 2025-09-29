import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportHeader } from "@/components/soc/ReportHeader";
import SeverityChart from "@/components/soc/SeverityChart";
import StatusChart from "@/components/soc/StatusChart";
import DailyIncidentsChart from "@/components/soc/DailyIncidentsChart";

type Props = {
  cliente: string;
  periodo: string;
  autores: string[];
  kpis: {
    incidentes: number;
    activos: number;
    mtta: string | number;
    mttr: string | number;
  };
  charts: {
    severity: any[];
    status: any[];
    daily: any[];
  };
};

export default function Page1Overview({
  cliente,
  periodo,
  autores,
  kpis,
  charts,
}: Props) {
  return (
    <section
      data-pdf-page
      className="a4 pdf-page px-6 py-6 grid gap-4"
      aria-label="Página 1 - Resumen general"
    >
      {/* Cabecera */}
      <ReportHeader cliente={cliente} periodo={periodo} autores={autores} />

      {/* KPIs (incidentes, activos, MTTA, MTTR) -> ✅ compactados */}
      {/* KPIs (incidentes, activos, MTTA, MTTR) — cuadros más bajos, mismo tamaño de texto */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="h-[88px] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium -mb-1">Incidentes</div>
          <div className="text-3xl font-bold leading-none">{kpis.incidentes ?? 0}</div>
        </Card>

        <Card className="h-[88px] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium -mb-1">Activos</div>
          <div className="text-3xl font-bold leading-none">{kpis.activos ?? 0}</div>
        </Card>

        <Card className="h-[88px] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium -mb-1">MTTA</div>
          <div className="text-3xl font-bold leading-none">{kpis.mtta ?? "-"}</div>
        </Card>

        <Card className="h-[88px] flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium -mb-1">MTTR</div>
          <div className="text-3xl font-bold leading-none">{kpis.mttr ?? "-"}</div>
        </Card>
      </div>


      {/* Donuts arriba a TODO el ancho */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 avoid-break">
        <Card className="h-[320px]">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Distribución por Severidad</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {charts.severity?.length ? (
              <SeverityChart data={charts.severity} />
            ) : (
              <div className="muted-placeholder">Sin datos</div>
            )}
          </CardContent>
        </Card>

        <Card className="h-[320px]">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">Estado de Incidentes</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            {charts.status?.length ? (
              <StatusChart data={charts.status} />
            ) : (
              <div className="muted-placeholder">Sin datos</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evolución diaria de incidentes (abajo en P1) */}
      <Card className="avoid-break">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">Evolución diaria de incidentes</CardTitle>
        </CardHeader>
        <CardContent className="h-[220px]">
          {charts.daily?.length ? (
            <DailyIncidentsChart data={charts.daily} />
          ) : (
            <div className="muted-placeholder">Sin datos</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
