import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IncidentsTable } from "@/components/soc/IncidentsTable";
import { RecommendationsSection } from "@/components/soc/RecommendationsSection";
import { HighlightedEventsSection } from "@/components/soc/HighlightedEventsSection";
import { GlossarySection } from "@/components/soc/GlossarySection";

type Props = {
  incidents: any[];
  events: any[];
  recommendations: any[];
  glossary: any[];
};

export default function Page3Records({
  incidents = [],
  events = [],
  recommendations = [],
  glossary = [],
}: Props) {
  return (
    <>
      {/* ====== Página 3A: SOLO la tabla ====== */}
      <section
        data-pdf-page
        className="a4 pdf-page px-0 py-0 grid gap-4"
        aria-label="Página 3 - Registro de incidentes"
      >
        <Card className="avoid-break overflow-hidden">
          {/* ⬇️ Quitamos el CardTitle externo para evitar duplicados.
              El IncidentsTable ya incluye su propio “Muestra de Incidentes Recientes”. */}
          <CardHeader className="pb-1" />
          <CardContent className="overflow-hidden">
            {incidents.length ? (
              <div className="w-full overflow-hidden">
                <IncidentsTable incidents={incidents} />
              </div>
            ) : (
              <div className="muted-placeholder">No hay incidentes registrados</div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ====== Página 3B/4: Eventos, Recomendaciones, Glosario ====== */}
      <section
        data-pdf-page
        className="a4 pdf-page px-0 py-0 grid gap-4"
        aria-label="Página 4 - Eventos, Recomendaciones y Glosario"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden avoid-break">
            <CardHeader className="pb-1" />
            <CardContent className="overflow-hidden">
              {events.length ? (
                <HighlightedEventsSection events={events} />
              ) : (
                <div className="muted-placeholder">Sin eventos para mostrar</div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden avoid-break">
            <CardHeader className="pb-1" />
            <CardContent className="overflow-hidden">
              {recommendations.length ? (
                <RecommendationsSection recommendations={recommendations} />
              ) : (
                <div className="muted-placeholder">Sin recomendaciones</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="avoid-break overflow-hidden">
          <CardHeader className="pb-1">
            {/* mantenemos solo este título */}
            <div className="text-sm font-semibold">Glosario</div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {glossary.length ? (
              <GlossarySection terms={glossary ?? []} />
            ) : (
              <div className="muted-placeholder">Sin términos de glosario</div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
