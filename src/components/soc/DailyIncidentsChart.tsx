import React from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

type Row = {
  date?: string; day?: string;
  Critical?: number; High?: number; Medium?: number; Low?: number; Informational?: number;
};

const DailyIncidentsChart: React.FC<{ data: Row[] }> = ({ data = [] }) => {
  try {
    const norm = (data || []).map(d => ({
      date: d.date ?? d.day ?? "",
      Critical: d.Critical ?? 0,
      High: d.High ?? 0,
      Medium: d.Medium ?? 0,
      Low: d.Low ?? 0,
      Informational: d.Informational ?? 0,
    }));

    if (!norm.length) return <div className="muted-placeholder">Sin datos</div>;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={norm} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />

          {/* ✅ Colores definidos (sin negros) */}
          <Bar dataKey="Low" stackId="a" fill="#22c55e" />          {/* verde */}
          <Bar dataKey="Medium" stackId="a" fill="#eab308" />       {/* amarillo */}
          <Bar dataKey="High" stackId="a" fill="#f59e0b" />         {/* ámbar */}
          <Bar dataKey="Critical" stackId="a" fill="#ef4444" />     {/* rojo */}
          <Bar dataKey="Informational" stackId="a" fill="#94a3b8" />{/* gris */}

          <Line type="monotone" dataKey="High" dot={false} stroke="#2563eb" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  } catch {
    return <div className="muted-placeholder">Gráfico no disponible</div>;
  }
};

export { DailyIncidentsChart };
export default DailyIncidentsChart;
