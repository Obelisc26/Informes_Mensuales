import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVEDetails } from "@/types/soc";

interface CVEDetailsCardProps {
  cve: CVEDetails;
}

export function CVEDetailsCard({ cve }: CVEDetailsCardProps) {
  return (
    <Card className="shadow-card h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-mono">{cve.cve}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {cve.tipo}
          </Badge>
        </div>
        <h4 className="font-semibold text-sm">{cve.titulo}</h4>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Descripción:</p>
          <p className="text-sm">{cve.descripcion}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Afecta:</p>
          <Badge variant="secondary" className="text-xs">
            {cve.afecta}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Mitigaciones:</p>
          <ul className="space-y-1">
            {cve.mitigacion.map((item, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="text-muted-foreground mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs font-medium text-primary">
            🔧 Acción: {cve.accion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}