import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlossaryTerm } from "@/types/soc";

interface GlossarySectionProps {
  terms: GlossaryTerm[];
  title?: string;
}

export function GlossarySection({ 
  terms, 
  title = "Glosario de Términos" 
}: GlossarySectionProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {terms.map((term, index) => (
            <div key={index} className="space-y-1">
              <dt className="font-semibold text-sm text-primary">
                {term.term}
              </dt>
              <dd className="text-sm text-muted-foreground">
                {term.def}
              </dd>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}