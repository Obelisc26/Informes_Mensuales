import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopCVEChart from "@/components/soc/TopCVEChart";
import TopAssetsChart from "@/components/soc/TopAssetsChart";
import MitreRadarChart from "@/components/soc/MitreRadarChart";

type Row = { name: string; value: number };

type CveDetail = {
  cve: string;
  titulo?: string;
  descripcion?: string;
  mitigacion?: string[];
  tipo?: string;
  afecta?: string;
  accion?: string;
  compact?: string;
};

type Props = {
  charts: {
    topCVE: Row[];
    topAssets: Row[];
    mitre: Row[];
  };
  ttpNotes?: string[];
  cveDetails?: CveDetail[];
};

const Page2Analysis: React.FC<Props> = ({
  charts = { topCVE: [], topAssets: [], mitre: [] },
  ttpNotes = [],
  cveDetails = [],
}) => {
  const topCVE = charts?.topCVE ?? [];
  const topAssets = charts?.topAssets ?? [];
  const mitre = charts?.mitre ?? [];

  const hasTopCVE = topCVE.length > 0;
  const hasTopAssets = topAssets.length > 0;
  const hasMitre = mitre.length > 0;
  const hasCveDetails = cveDetails.length > 0;

  // Fila 1: Top CVE + Activos (solo los que existan)
  const row1: React.ReactNode[] = [];
  if (hasTopCVE) {
    row1.push(
      <Card key="topcve" className="overflow-hidden">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">Top CVE</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-2">
          <TopCVEChart data={topCVE} />
        </CardContent>
      </Card>
    );
  }
  if (hasTopAssets) {
    row1.push(
      <Card key="assets" className="overflow-hidden">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">Activos más afectados</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-2">
          <TopAssetsChart data={topAssets} />
        </CardContent>
      </Card>
    );
  }

  // Fila 2: MITRE (si hay) + TTP (siempre)
  const row2: React.ReactNode[] = [];
  if (hasMitre) {
    row2.push(
      <Card key="mitre" className="overflow-hidden">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">Tácticas MITRE</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-2">
          <MitreRadarChart data={mitre} />
        </CardContent>
      </Card>
    );
  }
  row2.push(
    <Card key="ttp" className="overflow-hidden">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm">Interpretación TTP</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        {ttpNotes.length ? (
          <ul className="list-disc pl-5 text-sm">
            {ttpNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        ) : (
          <div className="muted-placeholder">Sin observaciones</div>
        )}
      </CardContent>
    </Card>
  );

  // Fila 3: Análisis detallado de CVE (solo si hay)
  const row3: React.ReactNode[] = [];
  if (hasCveDetails) {
    row3.push(
      <Card key="cve-details" className="overflow-hidden">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">Análisis detallado de CVE</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cveDetails.map((d, i) => (
              <div key={d.cve ?? i} className="border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">{d.cve}</div>
                <div className="font-medium text-sm mb-1">{d.titulo ?? d.tipo ?? "Vulnerabilidad"}</div>
                <div className="text-sm mb-2">
                  {d.descripcion ?? d.compact ?? "Ver detalles en NVD/proveedor."}
                </div>
                {d.mitigacion?.length ? (
                  <ul className="list-disc pl-4 text-xs">
                    {d.mitigacion.map((m, j) => (
                      <li key={j}>{m}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const gridClass = (count: number) =>
    count > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "grid grid-cols-1 gap-4";

  return (
    <section data-pdf-page className="a4 pdf-page px-0 py-0 grid gap-4" aria-label="Página 2 - Análisis">
      {row1.length > 0 && <div className={gridClass(row1.length)}>{row1}</div>}
      {row2.length > 0 && <div className={gridClass(row2.length)}>{row2}</div>}
      {row3.length > 0 && <div className={gridClass(row3.length)}>{row3}</div>}

      {row1.length + row2.length + row3.length === 0 && (
        <Card>
          <CardContent className="py-10">
            <div className="muted-placeholder">Sin datos de análisis para este período.</div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default Page2Analysis;
