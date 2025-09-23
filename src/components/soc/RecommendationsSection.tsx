import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/types/soc";

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  title?: string;
}

export function RecommendationsSection({ 
  recommendations, 
  title = "Recomendaciones Prioritarias" 
}: RecommendationsSectionProps) {
  const getDeadlineBadgeVariant = (deadline: string) => {
    if (deadline.includes("7 días")) return "destructive";
    if (deadline.includes("14 días")) return "secondary";
    return "default";
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="icon">
                  {rec.icon}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold">{rec.titulo}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.detalle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Responsable:
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {rec.owner}
                  </Badge>
                </div>
                
                <Badge 
                  variant={getDeadlineBadgeVariant(rec.deadline)}
                  className="text-xs"
                >
                  📅 {rec.deadline}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}