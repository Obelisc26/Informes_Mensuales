import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HighlightedEvent } from "@/types/soc";

interface HighlightedEventsSectionProps {
  events: HighlightedEvent[];
  title?: string;
}

export function HighlightedEventsSection({ 
  events, 
  title = "Eventos Destacados del Período" 
}: HighlightedEventsSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{event.titulo}</h4>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {formatDate(event.fecha)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.resumen}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}