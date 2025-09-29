import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

type Row = { name: string; value: number } & Record<string, any>;
type Props = { data: Row[] };

/** Normalización defensiva: asegura name/value numéricos y corta a 10 elementos */
function normalize(rows: Row[] = []) {
  return (rows || [])
    .map((r) => ({
      name:
        r.name ??
        r.label ??
        r.tactic ??
        r.tactics ??
        r.id ??
        "—",
      value: Number(r.value ?? r.count ?? 0),
    }))
    .filter((r) => !!r.name && !Number.isNaN(r.value))
    .slice(0, 10);
}

const MitreRadarChart: React.FC<Props> = ({ data = [] }) => {
  const norm = normalize(data);

  if (!norm.length) {
    return <div className="muted-placeholder">Sin datos</div>;
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={norm} margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Radar
            name="Tácticas"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--accent))"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MitreRadarChart;
