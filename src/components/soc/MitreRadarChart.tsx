import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface MitreData {
  name: string;
  value: number;
}

interface MitreRadarChartProps {
  data: MitreData[];
  title?: string;
}

export function MitreRadarChart({ data, title = "Tácticas MITRE ATT&CK" }: MitreRadarChartProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="name" 
                fontSize={10}
                className="text-xs"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, Math.max(...data.map(d => d.value)) + 1]}
                fontSize={10}
              />
              <Radar
                name="Incidentes"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}