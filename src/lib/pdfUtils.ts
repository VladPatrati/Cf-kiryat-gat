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
    
    // Wait for everything to settle (animations etc)
    // The score circle has a 1.5s animation, so we wait long enough
    await new Promise(resolve => setTimeout(resolve, 1800));

    const canvas = await html2canvas(element, {
      scale: 1.25, // Conservative scale for mobile stability
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1000, 
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force layout stabilization for the capture
          clonedElement.style.display = 'block';
          clonedElement.style.width = '1000px'; 
          clonedElement.style.height = 'auto';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '30px';
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
            el.style.fontFamily = 'Assistant, system-ui, sans-serif';
          });

          // Hide UI elements that shouldn't be in PDF
          const noPrint = clonedElement.querySelectorAll('.no-print');
          noPrint.forEach((el: any) => el.style.display = 'none');
          
          // Force chart responsiveness for capture
          const charts = clonedElement.querySelectorAll('.pdf-chart-container, .recharts-responsive-container');
          charts.forEach((chart: any) => {
            chart.style.width = '940px';
            chart.style.height = '400px';
            chart.style.minHeight = '400px';
            chart.style.display = 'block';
            chart.style.overflow = 'visible';
          });

          // Ensure charts internally are also forced to size
          const svgs = clonedElement.querySelectorAll('svg');
          svgs.forEach((svg: any) => {
            svg.setAttribute('width', '940');
            svg.setAttribute('height', '400');
          });

          // Fix specifically for the radar chart which can be finicky
          const radar = clonedElement.querySelector('.recharts-wrapper');
          if (radar) {
             (radar as HTMLElement).style.margin = '0 auto';
             (radar as HTMLElement).style.width = '940px';
          }

          // Ensure full contrast for black text or dark text
          const textElements = clonedElement.querySelectorAll('.text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600');
          textElements.forEach((el: any) => el.style.color = '#000000');
        }
      }
    });

    // Check if canvas was created correctly
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas was not created correctly');
    }

    const imgData = canvas.toDataURL('image/png');
    
    // Check if image data is valid
    if (!imgData || imgData.length < 100) {
       throw new Error('Failed to generate image data from canvas');
    }

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

    pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight, undefined, 'FAST');
    
    const fileName = `CrossFit_Report_${athleteName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
    
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('היתה שגיאה ביצירת ה-PDF. אנא נסה שוב.');
  }
};
