import { useEffect, useState } from "react";
import { generateReportData } from "@/data/socData";
import { ReportData } from "@/types/soc";
import { ReportHeader } from "./ReportHeader";
import { ReportActions } from "./ReportActions";
import { KPICard } from "./KPICard";
import { SeverityChart } from "./SeverityChart";
import { DailyIncidentsChart } from "./DailyIncidentsChart";
import { TopCVEChart } from "./TopCVEChart";
import { TopAssetsChart } from "./TopAssetsChart";
import { StatusChart } from "./StatusChart";
import { MitreRadarChart } from "./MitreRadarChart";
import { IncidentsTable } from "./IncidentsTable";
import { CVEDetailsCard } from "./CVEDetailsCard";
import { RecommendationsSection } from "./RecommendationsSection";
import { HighlightedEventsSection } from "./HighlightedEventsSection";
import { GlossarySection } from "./GlossarySection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Clock, Server } from "lucide-react";

interface SOCDashboardProps {
  cliente?: string;
  periodo?: string;
  autores?: string;
}

export function SOCDashboard({ 
  cliente,
  periodo,
  autores 
}: SOCDashboardProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      // Add small delay to simulate real data loading
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateReportData();
      setReportData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Generando informe SOC...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 print:p-4 print:max-w-none">
        {/* Actions Bar - Only visible on screen */}
        <div className="mb-6 print:hidden">
          <ReportActions reportElementId="soc-report" />
        </div>

        {/* Main Report Content */}
        <div id="soc-report" className="space-y-6">
          {/* Header */}
          <ReportHeader 
            cliente={cliente}
            periodo={periodo}
            autores={autores}
          />

          {/* Executive Summary KPIs */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              📊 Resumen Ejecutivo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <KPICard
                title="Incidentes Totales"
                value={reportData.incidentsTotal}
                icon={<TrendingUp />}
                variant="default"
              />
              <KPICard
                title="Activos Afectados"
                value={reportData.activosAffectados}
                icon={<Server />}
                variant="warning"
              />
              <KPICard
                title="MTTA"
                value={reportData.mtta}
                icon={<Clock />}
                variant="success"
              />
              <KPICard
                title="MTTR"
                value={reportData.mttr}
                icon={<Shield />}
                variant="default"
              />
            </div>
          </section>

          {/* Charts Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              📈 Análisis de Incidentes
            </h2>
            {/* Small charts side by side - optimized for both portrait and landscape */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 print:grid-cols-4">
              <div className="col-span-1 md:col-span-1 xl:col-span-1 print:col-span-1">
                <SeverityChart data={reportData.severityData} />
              </div>
              <div className="col-span-1 md:col-span-1 xl:col-span-1 print:col-span-1">
                <StatusChart data={reportData.statusData} />
              </div>
              <div className="col-span-1 md:col-span-1 xl:col-span-1 print:col-span-1">
                <TopCVEChart data={reportData.topCVEs} />
              </div>
              <div className="col-span-1 md:col-span-1 xl:col-span-1 print:col-span-1">
                <TopAssetsChart data={reportData.topAssets} />
              </div>
            </div>
            
            {/* Large chart - full width */}
            <div className="mb-6">
              <DailyIncidentsChart data={reportData.dailyIncidents} />
            </div>
          </section>

          {/* MITRE ATT&CK Analysis */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              🎯 Análisis MITRE ATT&CK
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MitreRadarChart data={reportData.mitreData} />
              <div>
                <Card className="shadow-card h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Interpretación de Tácticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        El análisis MITRE ATT&CK muestra las tácticas más frecuentes observadas en los incidentes:
                      </p>
                      <ul className="space-y-2">
                        {reportData.mitreData.slice(0, 4).map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="font-medium">{item.name}:</span>
                            <span className="text-muted-foreground">{item.value} incidentes</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-4">
                        Las tácticas más frecuentes indican los vectores de ataque principales 
                        y pueden ayudar a priorizar las defensas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CVE Details */}
          {reportData.cveDetails.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                🔍 Análisis Detallado de CVEs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {reportData.cveDetails.slice(0, 6).map((cve, index) => (
                  <CVEDetailsCard key={index} cve={cve} />
                ))}
              </div>
            </section>
          )}

          {/* Incidents Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              📋 Registro de Incidentes
            </h2>
            <IncidentsTable incidents={reportData.sampleIncidents} />
          </section>

          {/* Highlighted Events */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              ⭐ Eventos Relevantes
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <HighlightedEventsSection events={reportData.highlightedEvents} />
              <RecommendationsSection recommendations={reportData.recommendations} />
            </div>
          </section>

          {/* Glossary */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              📚 Glosario
            </h2>
            <GlossarySection terms={reportData.glossary} />
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              Informe generado automáticamente el {new Date().toLocaleString('es-ES')}
            </p>
            <p className="mt-1">
              SOC Dashboard v1.0 • Confidencial • Solo para uso interno
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}