import React from "react";

/** Tipado mínimo esperado por la tabla (coincide con lo que generas) */
export type SocIncident = {
  id: string;
  created_at: Date | string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational" | string;
  asset: string;
  incident_type: string;
  status: "Abierta" | "En revisión" | "Mitigada" | string;
  // cve?: string; // 🔕 columna removida
};

type Props = {
  incidents: SocIncident[];
};

const formatDate = (dt: Date | string) => {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}, ${hh}:${mi}`;
};

export const IncidentsTable: React.FC<Props> = ({ incidents = [] }) => {
  if (!incidents.length) {
    return <div className="muted-placeholder">Sin datos</div>;
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        Muestra de Incidentes Recientes
      </div>

      <div className="w-full overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Severidad</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {incidents.slice(0, 10).map((inc) => (
              <tr key={inc.id} className="border-t">
                <td className="p-2 align-middle">{inc.id}</td>
                <td className="p-2 align-middle">{formatDate(inc.created_at)}</td>
                {/* ⬇️ Texto plano, sin “chips” */}
                <td className="p-2 align-middle">
                  <span className="font-medium">{inc.severity}</span>
                </td>
                <td className="p-2 align-middle">{inc.asset}</td>
                <td className="p-2 align-middle">{inc.incident_type}</td>
                <td className="p-2 align-middle">
                  <span className="font-medium">{inc.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-2 text-xs text-muted-foreground">
        Mostrando 10 de {incidents.length} incidentes
      </div>
    </div>
  );
};

export default IncidentsTable;
