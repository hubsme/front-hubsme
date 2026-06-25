import { jsPDF } from 'jspdf';

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function areaDescription(areaName: string): string {
  const name = areaName.toLowerCase();
  if (name.includes('finan')) return 'Mejora tu rentabilidad y flujo de caja.';
  if (name.includes('operac')) return 'Optimiza procesos y eleva la eficiencia.';
  if (name.includes('equip') || name.includes('rrhh') || name.includes('organiza')) return 'Fortalece capacidades y alineación del equipo.';
  if (name.includes('merca') || name.includes('comerc')) return 'Aprovecha oportunidades y crece con foco.';
  return 'Optimiza el rendimiento estratégico de esta área.';
}

function drawStrategicFeedback(pdf: jsPDF, text: string, startX: number, startY: number, width: number): number {
  const paragraphs = text.split('\n');
  let y = startY;
  const margin = startX;
  const pageHeight = 780;

  for (let p of paragraphs) {
    p = p.trim();
    if (!p) {
      y += 6;
      continue;
    }

    if (p.startsWith('**') && p.includes('**')) {
      const endIdx = p.indexOf('**', 2);
      if (endIdx !== -1) {
        const headingText = p.substring(2, endIdx).trim();
        const restText = p.substring(endIdx + 2).trim();

        y += 12;
        if (y > pageHeight - 40) {
          pdf.addPage();
          y = margin + 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10.5);
        pdf.setTextColor(8, 112, 247);
        pdf.text(headingText, startX, y);
        y += 15;

        if (restText) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(71, 85, 105);
          
          let cleanRest = restText;
          if (cleanRest.startsWith(':')) cleanRest = cleanRest.substring(1).trim();

          const restLines = pdf.splitTextToSize(cleanRest, width) as string[];
          for (const rLine of restLines) {
            if (y > pageHeight - 20) {
              pdf.addPage();
              y = margin + 20;
            }
            pdf.text(rLine, startX, y);
            y += 13.5;
          }
          y += 4;
        }
        continue;
      }
    }

    if (p.startsWith('-') || p.startsWith('*')) {
      let listText = p.substring(1).trim();
      listText = listText.replace(/\*\*/g, '');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);

      const listLines = pdf.splitTextToSize(listText, width - 15) as string[];
      for (let i = 0; i < listLines.length; i++) {
        if (y > pageHeight - 20) {
          pdf.addPage();
          y = margin + 20;
        }
        if (i === 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(8, 112, 247);
          pdf.text('•', startX + 3, y);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(71, 85, 105);
          pdf.text(listLines[i], startX + 15, y);
        } else {
          pdf.text(listLines[i], startX + 15, y);
        }
        y += 13.5;
      }
      y += 4;
      continue;
    }

    const cleanParagraph = p.replace(/\*\*/g, '');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(71, 85, 105);

    const paragraphLines = pdf.splitTextToSize(cleanParagraph, width) as string[];
    for (const pLine of paragraphLines) {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = margin + 20;
      }
      pdf.text(pLine, startX, y);
      y += 14;
    }
    y += 6;
  }

  return y;
}

function addDocumentDecorations(pdf: jsPDF) {
  const totalPages = pdf.getNumberOfPages();
  const margin = 42;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    if (i > 1) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('HUBSME', margin, 24);

      pdf.setFont('helvetica', 'normal');
      const docTitle = 'INFORME DE DIAGNÓSTICO ESTRATÉGICO';
      const docTitleW = pdf.getTextWidth(docTitle);
      pdf.text(docTitle, pageWidth - margin - docTitleW, 24);

      pdf.setDrawColor(241, 245, 249);
      pdf.setLineWidth(0.5);
      pdf.line(margin, 28, pageWidth - margin, 28);
    }

    pdf.setDrawColor(241, 245, 249);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Reporte autogenerado con Inteligencia Artificial por Hubsme.', margin, pageHeight - 20);

    const pageNumStr = `Página ${i} de ${totalPages}`;
    const pageNumW = pdf.getTextWidth(pageNumStr);
    pdf.text(pageNumStr, pageWidth - margin - pageNumW, pageHeight - 20);
  }
}

export function downloadPdf(current: any) {
  if (!current) return;

  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 42;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;

  // 1. Header Card (Page 1)
  pdf.setDrawColor(217, 225, 236);
  pdf.setFillColor(255, 255, 255);
  pdf.setLineWidth(1);
  pdf.roundedRect(margin, 35, contentWidth, 90, 12, 12, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(8, 112, 247);
  pdf.text('DIAGNÓSTICO COMPLETADO', margin + 20, 60);

  pdf.setFontSize(18);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Tu informe estratégico está listo', margin + 20, 82);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(108, 122, 147);
  pdf.text('Resumen ejecutivo de la salud y oportunidades de tu negocio.', margin + 20, 98);
  pdf.text(`Fecha: ${formatDate(current.createdAt)}`, margin + 20, 112);

  // Score Circular Gauge Card inside header card
  const centerX = margin + contentWidth - 55;
  const centerY = 80;
  const score = current.score ?? 50;
  const priority = score < 60 ? 'ALTA' : (score < 75 ? 'MEDIA' : 'BAJA');
  
  let ringColor = score < 60 ? [240, 82, 82] : (score < 75 ? [194, 120, 3] : [14, 159, 110]);

  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(1);
  pdf.roundedRect(centerX - 40, centerY - 40, 80, 80, 12, 12, 'FD');

  pdf.setDrawColor(ringColor[0], ringColor[1], ringColor[2]);
  pdf.setLineWidth(4.5);
  pdf.ellipse(centerX, centerY - 8, 23, 23, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(15, 23, 42);
  const scoreStr = String(score);
  const scoreW = pdf.getTextWidth(scoreStr);
  pdf.text(scoreStr, centerX - scoreW / 2, centerY - 8);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  const limitW = pdf.getTextWidth('/100');
  pdf.text('/100', centerX - limitW / 2, centerY + 1);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(ringColor[0], ringColor[1], ringColor[2]);
  const prioW = pdf.getTextWidth(priority);
  pdf.text(priority, centerX - prioW / 2, centerY + 28);

  // 2. KPI Cards Row (5 Cards)
  const cardWidth = (contentWidth - 16) / 5;
  const kpis = [
    { label: 'PUNTAJE GLOBAL', val: `${score}/100`, color: [15, 23, 42] },
    { label: 'PRIORIDAD', val: score < 60 ? 'Alta' : (score < 75 ? 'Media' : 'Baja'), color: ringColor },
    { label: 'ÁREAS EVALUADAS', val: `${current.result.areasEvaluadas.length}`, color: [15, 23, 42] },
    { label: 'RECOMENDAC.', val: `${current.result.recomendaciones.length}`, color: [15, 23, 42] },
    { label: 'MEJORA', val: score < 60 ? 'Alto' : (score < 75 ? 'Medio' : 'Bajo'), color: [8, 112, 247] }
  ];

  pdf.setFont('helvetica', 'bold');
  pdf.setLineWidth(1);
  for (let i = 0; i < kpis.length; i++) {
    const kpiX = margin + i * (cardWidth + 4);
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(kpiX, 140, cardWidth, 42, 8, 8, 'FD');

    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(7.5);
    pdf.text(kpis[i].label, kpiX + 8, 153);

    pdf.setTextColor(kpis[i].color[0], kpis[i].color[1], kpis[i].color[2]);
    pdf.setFontSize(10.5);
    pdf.text(kpis[i].val, kpiX + 8, 172);
  }

  let yOffset = 215;

  // 3. Desempeño por Áreas Section (Clean Table)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('DESEMPEÑO POR ÁREAS', margin, yOffset);
  yOffset += 15;

  const headers = ['Área Evaluada', 'Tu Negocio', 'Promedio Sector', 'Análisis de Hallazgo'];
  const colWidths = [90, 75, 95, 251];
  
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yOffset, contentWidth, 22, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text(headers[0], margin + 10, yOffset + 14);
  
  const tcW = pdf.getTextWidth(headers[1]);
  pdf.text(headers[1], margin + colWidths[0] + (colWidths[1]/2) - (tcW/2), yOffset + 14);
  
  const psW = pdf.getTextWidth(headers[2]);
  pdf.text(headers[2], margin + colWidths[0] + colWidths[1] + (colWidths[2]/2) - (psW/2), yOffset + 14);
  
  pdf.text(headers[3], margin + colWidths[0] + colWidths[1] + colWidths[2] + 10, yOffset + 14);
  
  yOffset += 22;

  pdf.setLineWidth(0.5);
  for (const area of current.result.areasEvaluadas) {
    const textWidth = colWidths[3] - 20;
    const hallazgoLines = pdf.splitTextToSize(area.hallazgo || '', textWidth) as string[];
    const rowHeight = Math.max(28, 12 + hallazgoLines.length * 11.5 + 8);

    if (yOffset + rowHeight > 780) {
      pdf.addPage();
      yOffset = margin + 20;
      
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(margin, yOffset, contentWidth, 22, 'FD');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(headers[0], margin + 10, yOffset + 14);
      pdf.text(headers[1], margin + colWidths[0] + (colWidths[1]/2) - (tcW/2), yOffset + 14);
      pdf.text(headers[2], margin + colWidths[0] + colWidths[1] + (colWidths[2]/2) - (psW/2), yOffset + 14);
      pdf.text(headers[3], margin + colWidths[0] + colWidths[1] + colWidths[2] + 10, yOffset + 14);
      
      yOffset += 22;
    }

    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, yOffset + rowHeight, margin + contentWidth, yOffset + rowHeight);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(area.area, margin + 10, yOffset + 16);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(8, 112, 247);
    const scoreStr = `${area.puntaje}/100`;
    const scoreStrW = pdf.getTextWidth(scoreStr);
    pdf.text(scoreStr, margin + colWidths[0] + (colWidths[1]/2) - (scoreStrW/2), yOffset + 16);

    const name = area.area.toLowerCase();
    const avg = name.includes('finan') ? 60 : (name.includes('operac') ? 55 : (name.includes('equip') || name.includes('organi') ? 65 : 58));
    const avgStr = `${avg}/100`;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    const avgStrW = pdf.getTextWidth(avgStr);
    pdf.text(avgStr, margin + colWidths[0] + colWidths[1] + (colWidths[2]/2) - (avgStrW/2), yOffset + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text(hallazgoLines, margin + colWidths[0] + colWidths[1] + colWidths[2] + 10, yOffset + 15);

    yOffset += rowHeight;
  }
  yOffset += 20;

  // 4. Capacidades Detalladas Section (Cards with horizontal progress bars)
  if (yOffset + 120 > 780) {
    pdf.addPage();
    yOffset = margin + 20;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('CAPACIDADES DETALLADAS', margin, yOffset);
  yOffset += 15;

  for (const area of current.result.areasEvaluadas) {
    const name = area.area.toLowerCase();
    let color = [8, 112, 247]; 
    if (name.includes('operac')) color = [14, 159, 110];
    else if (name.includes('equip') || name.includes('rrhh') || name.includes('organi')) color = [194, 120, 3];
    else if (name.includes('merca') || name.includes('comerc')) color = [126, 58, 242];

    const cardHeight = 58;

    if (yOffset + cardHeight > 780) {
      pdf.addPage();
      yOffset = margin + 20;
    }

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, yOffset, contentWidth, cardHeight, 8, 8, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(area.area, margin + 15, yOffset + 18);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    const scoreText = `${area.puntaje}/100`;
    const scoreW = pdf.getTextWidth(scoreText);
    pdf.text(scoreText, margin + contentWidth - 15 - scoreW, yOffset + 18);

    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin + 15, yOffset + 24, contentWidth - 30, 5, 2.5, 2.5, 'F');

    pdf.setFillColor(color[0], color[1], color[2]);
    const fillWidth = (contentWidth - 30) * (area.puntaje / 100);
    pdf.roundedRect(margin + 15, yOffset + 24, fillWidth, 5, 2.5, 2.5, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    const desc = areaDescription(area.area);
    pdf.text(desc, margin + 15, yOffset + 43);

    yOffset += cardHeight + 8;
  }
  yOffset += 12;

  // 5. Proyección de Evolución (Table)
  if (yOffset + 100 > 780) {
    pdf.addPage();
    yOffset = margin + 20;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('PROYECCIÓN DE EVOLUCIÓN', margin, yOffset);
  yOffset += 15;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Puntaje estimado al implementar las recomendaciones estratégicas.', margin, yOffset);
  yOffset += 12;

  const cellWidth = contentWidth / 4;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.rect(margin, yOffset, contentWidth, 18, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  const headersProj = ['Actual', '3 meses', '6 meses', '12 meses'];
  for (let i = 0; i < 4; i++) {
    const x = margin + i * cellWidth;
    const wText = pdf.getTextWidth(headersProj[i]);
    pdf.text(headersProj[i], x + (cellWidth / 2) - (wText / 2), yOffset + 12);
  }
  yOffset += 18;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(margin, yOffset, contentWidth, 20, 'FD');
  const scoreActual = current.score ?? 50;
  const score3m = Math.min(100, Math.round(scoreActual + (100 - scoreActual) * 0.15));
  const score6m = Math.min(100, Math.round(scoreActual + (100 - scoreActual) * 0.3));
  const score12m = Math.min(100, Math.round(scoreActual + (100 - scoreActual) * 0.5));
  
  const valuesProj = [
    { val: `${scoreActual}/100`, color: [15, 23, 42] },
    { val: `${score3m}/100`, color: [8, 112, 247] },
    { val: `${score6m}/100`, color: [8, 112, 247] },
    { val: `${score12m}/100`, color: [8, 112, 247] }
  ];

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  for (let i = 0; i < 4; i++) {
    const x = margin + i * cellWidth;
    pdf.setTextColor(valuesProj[i].color[0], valuesProj[i].color[1], valuesProj[i].color[2]);
    const wVal = pdf.getTextWidth(valuesProj[i].val);
    pdf.text(valuesProj[i].val, x + (cellWidth / 2) - (wVal / 2), yOffset + 13);
  }
  yOffset += 20;

  pdf.addPage();
  yOffset = margin + 20;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('ANÁLISIS ESTRATÉGICO GENERAL (IA)', margin, yOffset);
  yOffset += 15;

  yOffset = drawStrategicFeedback(pdf, current.result.feedbackIa || '', margin, yOffset, contentWidth);
  yOffset += 25;

  if (yOffset + 120 > 780) {
    pdf.addPage();
    yOffset = margin + 20;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 23, 42);
  pdf.text('RECOMENDACIONES ESTRATÉGICAS PRIORITARIAS', margin, yOffset);
  yOffset += 18;

  let idx = 1;
  for (const rec of current.result.recomendaciones) {
    const titleWidth = contentWidth - 65;
    const actionLines = pdf.splitTextToSize(rec.accion || '', titleWidth) as string[];
    const benefitText = `Beneficio: ${rec.benefit} || Beneficio: ${rec.beneficioEsperado}`; // handles both schema structures
    const finalBenefit = rec.beneficioEsperado || rec.benefit || '';
    const benefitLines = pdf.splitTextToSize(`Beneficio: ${finalBenefit}`, titleWidth) as string[];
    const cardHeight = Math.max(48, 14 + actionLines.length * 13 + benefitLines.length * 12 + 18);

    if (yOffset + cardHeight > 780) {
      pdf.addPage();
      yOffset = margin + 20;
    }

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, yOffset, contentWidth, cardHeight, 8, 8, 'FD');
    pdf.setFillColor(14, 159, 110);
    pdf.roundedRect(margin, yOffset, 4, cardHeight, 4, 4, 'F');
    pdf.rect(margin + 2, yOffset, 2, cardHeight, 'F');
    pdf.setFillColor(236, 253, 245);
    pdf.setDrawColor(167, 243, 208);
    pdf.ellipse(margin + 24, yOffset + 24, 11, 11, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(14, 159, 110);
    const idxStr = String(idx++);
    const idxW = pdf.getTextWidth(idxStr);
    pdf.text(idxStr, margin + 24 - idxW / 2, yOffset + 27);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(actionLines, margin + 45, yOffset + 18);

    let textY = yOffset + 18 + actionLines.length * 13;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(108, 122, 147);
    pdf.text(`Plazo: ${rec.plazo}  |  Prioridad: ${rec.prioridad}`, margin + 45, textY + 4);
    textY += 13;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text(benefitLines, margin + 45, textY + 3);
    yOffset += cardHeight + 8;
  }

  addDocumentDecorations(pdf);
  pdf.save(`diagnostico-${current.id}.pdf`);
}
