import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Row = { name: string; value: number };
type Props = { data: Row[] };

const TopAssetsChart: React.FC<Props> = ({ data = [] }) => {
  if (!data.length) return <div className="muted-placeholder">Sin datos</div>;

  return (
    <div className="w-full h-[220px]"> {/* altura más compacta */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 8, left: 8, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fontSize: 11 }}
            angle={-25}             // ✅ diagonal
            height={60}
            tickMargin={10}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" barSize={16} radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopAssetsChart;
