import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type Row = { name: string; value: number; color?: string };
type Props = { data: Row[] };

/** Leyenda compacta fuera del gráfico (no roba altura) */
function CompactLegend({ data }: { data: Row[] }) {
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] leading-tight">
      {data.map((d, i) => (
        <div key={i} className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-sm"
            style={{ backgroundColor: d.color || "#8884d8" }}
          />
          <span style={{ color: d.color || "#8884d8" }}>
            {d.name} ({d.value})
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SeverityChart({ data }: Props) {
  // ✅ Eliminar "Informational" y valores 0 (por si acaso)
  const cleaned =
    (data ?? []).filter(
      (d) => d?.value > 0 && (d?.name ?? "").toLowerCase() !== "informational"
    ) || [];

  const total = cleaned.reduce((s, d) => s + (d?.value ?? 0), 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null;
    const RAD = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  // Si al filtrar no queda nada, mostramos una pista
  if (!cleaned.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        Sin datos de severidad (excluyendo “Informational”)
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Pie grande */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleaned}
              cx="50%"
              cy="52%"
              outerRadius={84}
              labelLine={false}
              label={renderCustomLabel}
              dataKey="value"
            >
              {cleaned.map((entry, i) => (
                <Cell key={i} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: number) => [v, "Incidentes"]}
              labelFormatter={(label: string) => `Severidad: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda compacta */}
      <CompactLegend data={cleaned} />

      <div className="mt-1 text-center text-xs text-muted-foreground">
        Total: <span className="font-semibold">{total}</span> incidentes
      </div>
    </div>
  );
}
