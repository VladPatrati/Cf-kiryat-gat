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
    console.log('Generating high-quality PDF for:', athleteName);
    
    // Wait for everything to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    const canvas = await html2canvas(element, {
      scale: 3, // High resolution for quality print
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Force desktop-width layout even on mobile phones
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force layout stabilization for the capture
          clonedElement.style.display = 'block';
          clonedElement.style.width = '1200px'; 
          clonedElement.style.height = 'auto';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '50px';
          clonedElement.style.borderRadius = '0';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.direction = 'rtl';
          clonedElement.style.textAlign = 'right';
          clonedElement.style.overflow = 'visible';
          
          // Ensure all text nodes are RTL and have correct font
          clonedElement.querySelectorAll('*').forEach((el: any) => {
            el.style.direction = 'rtl';
            el.style.boxShadow = 'none';
            el.style.textShadow = 'none';
            // Force fonts
            el.style.fontFamily = '"Assistant", "Inter", sans-serif';
          });

          // Hide UI elements that shouldn't be in PDF
          const noPrint = clonedElement.querySelectorAll('.no-print');
          noPrint.forEach((el: any) => el.style.display = 'none');
          
          // Force chart responsiveness
          const charts = clonedElement.querySelectorAll('.pdf-chart-container, .recharts-responsive-container');
          charts.forEach((chart: any) => {
            chart.style.width = '1100px';
            chart.style.maxWidth = '1100px';
            chart.style.height = '450px';
            chart.style.minHeight = '450px';
            chart.style.display = 'block';
            chart.style.overflow = 'visible';
          });

          // Fix specifically for the radar chart which can be finicky
          const radar = clonedElement.querySelector('.recharts-wrapper');
          if (radar) {
             (radar as HTMLElement).style.margin = '0 auto';
          }

          // Ensure full contrast for black text
          const blacks = clonedElement.querySelectorAll('.text-slate-900, .text-slate-800, .text-slate-700');
          blacks.forEach((el: any) => el.style.color = '#000000');
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Physical margins (mm)
    const margin = 10;
    const innerWidth = pdfWidth - (margin * 2);
    
    // Calculate proportions to fit A4 perfectly
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalWidth = innerWidth;
    let finalHeight = innerWidth / ratio;
    
    // Only scale down if it exceeds page height
    if (finalHeight > (pdfHeight - margin * 2)) {
      finalHeight = pdfHeight - margin * 2;
      finalWidth = finalHeight * ratio;
    }

    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = 10; 

    pdf.addImage(imgData, 'JPEG', marginX, marginY, finalWidth, finalHeight, undefined, 'FAST');
    
    const fileName = `CrossFit_Report_${athleteName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('היתה שגיאה ביצירת ה-PDF. אנא נסה שוב.');
  }
};
