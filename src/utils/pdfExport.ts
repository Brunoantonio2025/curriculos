import html2pdf from 'html2pdf.js';

export const downloadPDF = (elementId: string = 'curriculum-preview', fileName: string = 'curriculo.pdf') => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert('Erro ao encontrar o currículo para exportação.');
    return;
  }

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: fileName,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 794,
      windowHeight: 1123
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // Força o download direto sem abrir preview de impressão
  html2pdf()
    .set(opt)
    .from(element)
    .toPdf()
    .get('pdf')
    .then((pdf: any) => {
      pdf.save(fileName);
    })
    .catch((error: any) => {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    });
};

