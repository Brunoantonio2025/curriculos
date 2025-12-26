export const downloadPDF = (fileName: string = 'curriculo.pdf') => {
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Por favor, permita pop-ups para baixar o PDF');
    return;
  }

  const previewElement = document.getElementById('curriculum-preview');

  if (!previewElement) {
    alert('Erro ao gerar PDF');
    return;
  }

  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          ${styles}

          @media print {
            body {
              margin: 0;
              padding: 20px;
              background: white;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          }
        </style>
      </head>
      <body>
        ${previewElement.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 250);
};
