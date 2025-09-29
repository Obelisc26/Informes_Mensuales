import * as html2canvasNS from "html2canvas";
import jsPDF from "jspdf";

type Options = {
  filename?: string;
  pageSelector?: string; // por defecto: [data-pdf-page]
};

// helper para usar el default de html2canvas sin pelear con tsconfig
const html2canvas = (html2canvasNS as any).default ?? (html2canvasNS as any);

/**
 * Exporta el informe por páginas A4 (cada .a4 = 1 página).
 * No reduce el layout: si hay más contenido, añade páginas.
 */
export async function exportReportByPages(
  rootEl: HTMLElement,
  opts: Options = {}
) {
  const { filename = "informe-soc.pdf", pageSelector = "[data-pdf-page]" } = opts;

  // activar modo impresión en el contenedor
  const prevClasses = rootEl.className;
  rootEl.classList.add("print-mode");

  const pages = Array.from(rootEl.querySelectorAll<HTMLElement>(pageSelector));
  if (!pages.length) {
    rootEl.className = prevClasses;
    throw new Error("No se encontraron páginas con [data-pdf-page].");
  }

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pdfW = pdf.internal.pageSize.getWidth();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const canvas = await html2canvas(page, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgW = pdfW;
    const imgH = (canvas.height * pdfW) / canvas.width;

    if (i > 0) pdf.addPage("a4", "portrait");
    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
  }

  pdf.save(filename);
  rootEl.className = prevClasses;
}
