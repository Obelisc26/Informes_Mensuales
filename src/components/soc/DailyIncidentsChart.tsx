import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DailyIncidentsData {
  date: string;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
  Informational: number;
}

interface DailyIncidentsChartProps {
  data: DailyIncidentsData[];
  title?: string;
}

export function DailyIncidentsChart({ data, title = "Evolución Diaria de Incidentes" }: DailyIncidentsChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => `Fecha: ${formatDate(value)}`}
                formatter={(value: number, name: string) => [value, name]}
              />
              <Legend />
              <Bar 
                dataKey="Critical" 
                stackId="a" 
                fill="hsl(var(--critical))" 
                name="Critical"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="High" 
                stackId="a" 
                fill="hsl(var(--high))" 
                name="High"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Medium" 
                stackId="a" 
                fill="hsl(var(--medium))" 
                name="Medium"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Low" 
                stackId="a" 
                fill="hsl(var(--low))" 
                name="Low"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="Informational" 
                stackId="a" 
                fill="hsl(var(--info))" 
                name="Informational"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}