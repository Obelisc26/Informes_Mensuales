import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TopAssetsData {
  name: string;
  value: number;
}

interface TopAssetsChartProps {
  data: TopAssetsData[];
  title?: string;
}

export function TopAssetsChart({ data, title = "Activos Más Afectados" }: TopAssetsChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="horizontal"
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                fontSize={11}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [value, "Eventos"]}
                labelFormatter={(label) => `Activo: ${label}`}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--accent))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}