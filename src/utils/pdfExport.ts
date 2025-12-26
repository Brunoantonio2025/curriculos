import html2pdf from 'html2pdf.js';

export const downloadPDF = (elementId: string = 'curriculum-preview', fileName: string = 'curriculo.pdf') => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert('Erro ao encontrar o currículo para exportação.');
    return;
  }

  const opt = {
    margin: 0,
    filename: fileName,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  // No celular, as pessoas preferem o download direto
  // html2pdf().from(element).set(opt).save() faz exatamente isso
  html2pdf().set(opt).from(element).save();
};

