import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const exportToPDF = async (
  elementId: string,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = `SOC-Report-${new Date().toISOString().split('T')[0]}.pdf`,
    quality = 0.95,
    scale = 2
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Add print class for better PDF styling
    const originalClasses = element.className;
    element.classList.add('print-mode');
    
    // Wait for potential layout changes
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from element with better settings
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: element.scrollHeight,
      width: element.scrollWidth,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: element.scrollHeight
    });

    // Restore original classes
    element.className = originalClasses;

    // PDF dimensions with margins (A4: 210x297mm)
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 4; // 4mm margins for maximum content width
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);
    
    // Calculate image width to fit page width (maintain readability)
    const imgWidth = contentWidth;
    // Calculate proportional height based on original aspect ratio
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Position on page
    const xOffset = margin;
    const yOffset = margin;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate how many pages we need
    const pageContentHeight = contentHeight;
    const totalImageHeight = imgHeight;
    const pagesNeeded = Math.ceil(totalImageHeight / pageContentHeight);
    
    for (let page = 0; page < pagesNeeded; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      // Calculate source rectangle for this page
      const srcY = (page * pageContentHeight * canvas.height) / totalImageHeight;
      const srcHeight = Math.min(
        (pageContentHeight * canvas.height) / totalImageHeight,
        canvas.height - srcY
      );
      
      // Create a temporary canvas for this page's content
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx && srcHeight > 0) {
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcHeight;
        
        // Draw the portion of the original canvas for this page
        pageCtx.drawImage(
          canvas,
          0, srcY, canvas.width, srcHeight,
          0, 0, canvas.width, srcHeight
        );
        
        // Add to PDF
        const pageImgHeight = (srcHeight * imgWidth) / canvas.width;
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', quality),
          'JPEG',
          xOffset,
          yOffset,
          imgWidth,
          pageImgHeight
        );
      }
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const printReport = (): void => {
  window.print();
};