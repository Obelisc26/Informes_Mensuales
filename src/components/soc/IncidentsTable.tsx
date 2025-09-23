import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SocIncident } from "@/types/soc";

interface IncidentsTableProps {
  incidents: SocIncident[];
  title?: string;
}

const severityVariants = {
  Critical: "destructive",
  High: "secondary", 
  Medium: "outline",
  Low: "default",
  Informational: "secondary"
} as const;

const statusVariants = {
  "Abierta": "destructive",
  "En revisión": "secondary",
  "Mitigada": "default"
} as const;

export function IncidentsTable({ incidents, title = "Muestra de Incidentes Recientes" }: IncidentsTableProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CVE</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.slice(0, 10).map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(incident.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={severityVariants[incident.severity]}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{incident.asset}</TableCell>
                  <TableCell className="text-sm">{incident.incident_type}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {incident.cve || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[incident.status]}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {incidents.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando 10 de {incidents.length} incidentes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}