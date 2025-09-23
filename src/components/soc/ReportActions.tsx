import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer, Share2 } from "lucide-react";
import { exportToPDF, printReport } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";

interface ReportActionsProps {
  reportElementId: string;
  onShare?: () => void;
}

export function ReportActions({ reportElementId, onShare }: ReportActionsProps) {
  const { toast } = useToast();

  const handleExportToPDF = async () => {
    try {
      toast({
        title: "Generando PDF...",
        description: "Por favor espere mientras se genera el informe.",
      });

      await exportToPDF(reportElementId, {
        filename: `SOC-Informe-${new Date().toISOString().split('T')[0]}.pdf`
      });

      toast({
        title: "PDF generado exitosamente",
        description: "El informe ha sido descargado.",
      });
    } catch (error) {
      toast({
        title: "Error al generar PDF",
        description: "Hubo un problema al generar el informe. Inténtelo nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    printReport();
  };

  return (
    <Card className="shadow-card print:hidden">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleExportToPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          
          {onShare && (
            <Button onClick={onShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}