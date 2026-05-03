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
      scale: 2, // 2x is usually enough and more stable than 3x for large elements
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force layout stabilization for the capture
          clonedElement.style.display = 'block';
          clonedElement.style.width = '1000px'; 
          clonedElement.style.height = 'auto';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '40px';
          clonedElement.style.borderRadius = '0';
          clonedElement.style.direction = 'rtl';
          clonedElement.style.textAlign = 'right';
          
          // Ensure all text nodes are RTL
          clonedElement.querySelectorAll('*').forEach((el: any) => {
            el.style.direction = 'rtl';
          });
          
          // Fix for Recharts ResponsiveContainers in html2canvas
          const charts = clonedElement.querySelectorAll('.recharts-responsive-container');
          charts.forEach((chart: any) => {
            chart.style.width = '1000px'; // Use explicit width during capture
            chart.style.height = '400px';
            chart.style.minHeight = '400px';
          });
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate proportions to fit A4 perfectly
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth / ratio;
    
    // If it's too tall for one page, we could add pages, 
    // but for this report, we'll fit it to width and let height be what it is or scale down
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight * ratio;
    }

    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = 5; // Small top margin

    pdf.addImage(imgData, 'JPEG', marginX, marginY, finalWidth, finalHeight, undefined, 'FAST');
    
    const fileName = `CrossFit_Report_${athleteName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('היתה שגיאה ביצירת ה-PDF. אנא נסה שוב.');
  }
};
