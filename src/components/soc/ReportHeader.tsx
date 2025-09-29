import { Card, CardContent } from "@/components/ui/card";

interface ReportHeaderProps {
  cliente?: string;
  periodo?: string;
  autores?: string | string[];
  /** Baja la línea separadora (px). Ej: 20–28 si la quieres más centrada */
  lineOffsetPx?: number;
}

/**
 * Mantiene el layout original de Lovable pero:
 *  - Permite bajar la línea separadora con `lineOffsetPx`
 *  - Reduce el espacio debajo de la fecha sin cambiar el tamaño de la tipografía
 */
export function ReportHeader({
  cliente = "ACME Corp",
  periodo = "01–30 jun 2025",
  autores = "Equipo SOC",
  lineOffsetPx = 16, // ← súbelo a 22–28 para bajar más la línea
}: ReportHeaderProps) {
  const autoresText = Array.isArray(autores) ? autores.join(", ") : autores;

  return (
    <Card className="bg-gradient-primary text-white shadow-elevated">
      {/* compactamos un poco el padding inferior del bloque azul */}
      <CardContent className="p-8 pb-2">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold">Informe SOC Trimestral</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-sm font-medium opacity-80 mb-1">Cliente</h3>
              <p className="text-lg font-semibold">{cliente}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80 mb-1">Período</h3>
              <p className="text-lg font-semibold">{periodo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80 mb-1">Elaborado por</h3>
              <p className="text-lg font-semibold">{autoresText}</p>
            </div>
          </div>

          {/* ⬇️ Espaciador explícito: controla dónde cae la línea */}
          <div style={{ height: lineOffsetPx }} />

          {/* Línea + fecha con muy poco aire inferior */}
          <div className="pt-2 pb-0 border-t border-white/20">
            <p className="text-sm opacity-80 leading-tight">
              Generado el{" "}
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
