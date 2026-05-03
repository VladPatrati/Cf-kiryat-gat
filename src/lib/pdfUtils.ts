import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, athleteName: string = 'Athlete') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    console.log('Generating PDF for:', athleteName);
    
    // Sometimes a short delay helps ensure all animations are finished
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true, // Turn on logging for debugging
      backgroundColor: '#ffffff',
      allowTaint: true,
      onclone: (clonedDoc) => {
        // Ensure the cloned element is visible even if the original is hidden
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Safer download for iframes
    const fileName = `CrossFit_Assessment_${athleteName.replace(/\s+/g, '_')}.pdf`;
    const pdfOutput = pdf.output('blob');
    const url = URL.createObjectURL(pdfOutput);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('היתה שגיאה ביצירת ה-PDF. אנא נסה שוב.');
  }
};
