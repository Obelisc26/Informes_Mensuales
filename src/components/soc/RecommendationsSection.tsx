import React from "react";

export type Recommendation = {
  icon?: string;
  titulo: string;
  detalle?: string;
  // owner?: string;          // ⬅️ Eliminado de la UI
  deadline?: string;
};

type Props = {
  recommendations: Recommendation[];
};

/**
 * Lista de recomendaciones PRIORITARIAS sin el campo "Responsable".
 * Cambios mínimos: sólo se removió la fila que mostraba el owner.
 */
export const RecommendationsSection: React.FC<Props> = ({
  recommendations = [],
}) => {
  if (!recommendations.length) {
    return <div className="muted-placeholder">Sin recomendaciones</div>;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => (
        <div
          key={`${rec.titulo}-${idx}`}
          className="rounded-md border bg-card shadow-sm px-3 py-3"
        >
          {/* Cabecera: icono + título */}
          <div className="flex items-start gap-2">
            {rec.icon ? (
              <span aria-hidden className="text-xl leading-none">
                {rec.icon}
              </span>
            ) : (
              <span aria-hidden className="w-5 h-5 rounded-sm bg-muted inline-block" />
            )}
            <div className="min-w-0">
              <div className="font-semibold text-sm text-foreground">
                {rec.titulo}
              </div>
              {rec.detalle ? (
                <div className="text-xs text-muted-foreground">
                  {rec.detalle}
                </div>
              ) : null}
            </div>
          </div>

          {/* Pie: solo deadline (se mantiene) */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-muted-foreground"></div>
            {rec.deadline ? (
              <span className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 px-2 h-5 text-[11px] leading-none">
                {rec.deadline}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsSection;
