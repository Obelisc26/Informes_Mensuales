import { Card, CardContent } from "@/components/ui/card";

interface ReportHeaderProps {
  cliente?: string;
  periodo?: string;
  autores?: string;
}

export function ReportHeader({ 
  cliente = "ACME Corp",
  periodo = "01–30 jun 2025", 
  autores = "Equipo SOC"
}: ReportHeaderProps) {
  return (
    <Card className="bg-gradient-primary text-white shadow-elevated">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold">
              Informe SOC Trimestral
            </h1>
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
              <p className="text-lg font-semibold">{autores}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <p className="text-sm opacity-80">
              Generado el {new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}