interface ChartImages { barChart?: string; radarChart?: string; lineChart?: string }

export type { ChartImages };

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildReportHtml(diagnostic: any, chartImages?: ChartImages, format: 'pdf' | 'word' = 'pdf'): string {
  if (!diagnostic) return '';

  const score = diagnostic.score ?? 50;
  const priority = score < 60 ? 'Alta' : score < 75 ? 'Media' : 'Baja';
  const priorityColor = score < 60 ? '#f05252' : score < 75 ? '#c27803' : '#0e9f6e';
  const badgeText = score < 60 ? 'Atención prioritaria' : score < 75 ? 'Mejora continua' : 'Mantener nivel';
  const potential = score < 60 ? 'Alto' : score < 75 ? 'Medio' : 'Bajo';

  const p2 = Math.min(100, Math.round(score + (100 - score) * 0.15));
  const p3 = Math.min(100, Math.round(score + (100 - score) * 0.3));
  const p4 = Math.min(100, Math.round(score + (100 - score) * 0.5));

  const areaColors: Record<string, { color: string; desc: string }> = {
    default: { color: '#0870f7', desc: 'Mejora tu rentabilidad y flujo de caja.' },
    finan: { color: '#0870f7', desc: 'Mejora tu rentabilidad y flujo de caja.' },
    tribut: { color: '#0870f7', desc: 'Optimiza tus obligaciones tributarias y contabilidad.' },
    contab: { color: '#0870f7', desc: 'Optimiza tus obligaciones tributarias y contabilidad.' },
    operac: { color: '#0e9f6e', desc: 'Optimiza procesos y eleva la eficiencia.' },
    tecnol: { color: '#0e9f6e', desc: 'Impulsa tu digitalización y adopción de herramientas.' },
    equip: { color: '#c27803', desc: 'Fortalece capacidades y alineación del equipo.' },
    organi: { color: '#c27803', desc: 'Fortalece capacidades y alineación del equipo.' },
    labor: { color: '#c27803', desc: 'Gestiona el cumplimiento de obligaciones con tu equipo.' },
    legal: { color: '#c27803', desc: 'Asegura tu cumplimiento normativo y contratos.' },
    merca: { color: '#7e3af2', desc: 'Aprovecha oportunidades y crece con foco.' },
    comerc: { color: '#7e3af2', desc: 'Aprovecha oportunidades y crece con foco.' },
    client: { color: '#7e3af2', desc: 'Mejora la satisfacción y retención de tus clientes.' },
    servi: { color: '#7e3af2', desc: 'Mejora la satisfacción y retención de tus clientes.' },
    estrat: { color: '#0ea5e9', desc: 'Define objetivos claros y dirección de tu negocio.' },
  };

  function getAreaStyle(name: string) {
    const key = Object.keys(areaColors).find(k => k !== 'default' && name.toLowerCase().includes(k));
    return areaColors[key || 'default'];
  }

  function sectorAvg(name: string) {
    const n = name.toLowerCase();
    return n.includes('finan') ? 60 : n.includes('operac') ? 55 : n.includes('equip') || n.includes('organi') ? 65 : 58;
  }

  // Build chart images section - if html2canvas captured them, embed as base64 directly
  const chartKeys: (keyof ChartImages)[] = ['barChart', 'radarChart', 'lineChart'];
  const chartLabels = ['Desempeño por áreas', 'Capacidades del negocio', 'Proyección de evolución'];
  const hasCharts = chartKeys.some(k => chartImages?.[k]);

  // Define image references for MHTML boundaries
  const barChartRef = chartImages?.barChart ? 'file:///img_barChart.png' : '';
  const radarChartRef = chartImages?.radarChart ? 'file:///img_radarChart.png' : '';
  const lineChartRef = chartImages?.lineChart ? 'file:///img_lineChart.png' : '';

  const chartsRow = hasCharts ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;border:1px solid #e2e8f0;">
      <tr>
        <td style="width:60%;padding:8px;vertical-align:middle;text-align:center;border:1px solid #e2e8f0;" rowspan="2">
          <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">${chartLabels[0]}</div>
          ${barChartRef ? `<img src="${barChartRef}" width="300" height="190" />` : ''}
        </td>
        <td style="width:40%;padding:8px;vertical-align:middle;text-align:center;border:1px solid #e2e8f0;">
          <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">${chartLabels[1]}</div>
          ${radarChartRef ? `<img src="${radarChartRef}" width="190" height="90" />` : ''}
        </td>
      </tr>
      <tr>
        <td style="width:40%;padding:8px;vertical-align:middle;text-align:center;border:1px solid #e2e8f0;">
          <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">${chartLabels[2]}</div>
          ${lineChartRef ? `<img src="${lineChartRef}" width="190" height="90" />` : ''}
        </td>
      </tr>
    </table>
  ` : '';

  // Area cards row (Lowest 4 areas to highlight critical domains)
  const mainAreas = [...(diagnostic.result.areasEvaluadas || [])]
    .sort((a: any, b: any) => a.puntaje - b.puntaje)
    .slice(0, 4);

  const cardColors = ['#0870f7', '#0e9f6e', '#c27803', '#7e3af2'];
  const areaCards = `
    <table style="width:100%;border-collapse:separate;border-spacing:12px 0;margin-top:10px;margin-bottom:20px;">
      <tr>
        ${mainAreas.map((area: { area: string; puntaje: number }, index: number) => {
          const color = cardColors[index % 4];
          const { desc } = getAreaStyle(area.area);
          return `
            <td style="width:25%;padding:12px;vertical-align:top;border:1px solid #e2e8f0;border-radius:12px;background:#fff;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="font-weight:bold;font-size:11px;color:#1e293b;padding:0;">${area.area}</td>
                  <td style="text-align:right;font-weight:bold;font-size:14px;color:${color};padding:0;">${area.puntaje}<span style="font-size:9px;color:#94a3b8;font-weight:normal;">/100</span></td>
                </tr>
              </table>
              <table style="width:100%;border-collapse:collapse;margin-top:6px;">
                <tr>
                  <td style="background:${color};height:4px;width:${area.puntaje}%;padding:0;font-size:1px;">&nbsp;</td>
                  <td style="background:#f1f5f9;height:4px;width:${100 - area.puntaje}%;padding:0;font-size:1px;">&nbsp;</td>
                </tr>
              </table>
              <p style="margin:6px 0 0;font-size:9px;color:#64748b;line-height:1.3;">${desc}</p>
            </td>`;
        }).join('')}
      </tr>
    </table>`;

  // Areas table rows
  const areasRows = (diagnostic.result.areasEvaluadas || []).map((area: { area: string; puntaje: number; hallazgo: string }) => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;font-weight:bold;color:#1e293b;font-size:12px;">${area.area}</td>
      <td style="padding:10px;color:#0870f7;font-weight:bold;text-align:center;font-size:12px;">${area.puntaje}/100</td>
      <td style="padding:10px;color:#64748b;text-align:center;font-size:12px;">${sectorAvg(area.area)}/100</td>
      <td style="padding:10px;color:#475569;font-size:12px;">${area.hallazgo}</td>
    </tr>
  `).join('');

  // Recommendations rows
  const recsRows = (diagnostic.result.recomendaciones || []).map((rec: { accion: string; beneficioEsperado: string }, i: number) => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;font-weight:bold;color:#0e9f6e;text-align:center;width:30px;font-size:12px;">${i + 1}</td>
      <td style="padding:10px;font-size:12px;">
        <div style="font-weight:bold;color:#1e293b;margin-bottom:3px;">${rec.accion}</div>
        <div style="font-size:11px;color:#64748b;"><strong>Beneficio esperado:</strong> ${rec.beneficioEsperado}</div>
      </td>
    </tr>
  `).join('');

  const showTables = format !== 'word';

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Diagnóstico Empresarial - Hubsme</title>
      <style>
        @page WordSection1 { size:595.35pt 841.95pt; margin:1.5cm; mso-page-orientation:portrait; }
        .WordSection1 { page:WordSection1; }
        body { font-family:'Segoe UI',Arial,sans-serif; line-height:1.5; color:#334155; background:#fff; padding:0; }
        h1 { color:#0f172a; font-size:22px; margin:0 0 5px; }
        h2 { color:#0870f7; font-size:15px; margin:25px 0 12px; padding-bottom:3px; border-bottom:1.5px solid #e2e8f0; }
        p { font-size:12px; color:#475569; }
      </style>
    </head>
    <body>
      <div class="WordSection1" style="width:100%;background:#fff;">
        <!-- Hero -->
        <div style="border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin-bottom:25px;">
          <table style="width:100%;border-collapse:collapse;"><tr>
            <td style="vertical-align:top;">
              <span style="display:inline-block;padding:2px 8px;border-radius:10px;background:#ebf1f9;color:#0870f7;font-size:10px;font-weight:bold;text-transform:uppercase;">Diagnóstico Completado</span>
              <h1 style="font-size:20px;margin:8px 0;color:#0f172a;">Tu informe estratégico está listo</h1>
              <p style="margin:0;font-size:12px;color:#64748b;">Resumen ejecutivo de la salud y oportunidades de tu negocio.</p>
              <p style="margin:5px 0 0;font-size:11px;color:#94a3b8;">Fecha: ${formatDate(diagnostic.createdAt)}</p>
            </td>
            <td style="width:120px;text-align:center;vertical-align:middle;background:#f8fafc;border-radius:12px;padding:15px;">
              <div style="font-size:28px;font-weight:bold;color:#0f172a;line-height:1;">${score}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:2px;">/100</div>
              <div style="margin-top:10px;font-size:9px;font-weight:bold;text-transform:uppercase;color:${priorityColor};">${badgeText}</div>
            </td>
          </tr></table>
        </div>

        <!-- KPI Row -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:25px;"><tr>
          ${[
            { label: 'Puntaje Global', value: `${score}/100`, color: '#0f172a' },
            { label: 'Prioridad', value: priority, color: priorityColor },
            { label: 'Áreas', value: diagnostic.result.areasEvaluadas.length, color: '#0f172a' },
            { label: 'Recomendac.', value: diagnostic.result.recomendaciones.length, color: '#0f172a' },
            { label: 'Mejora', value: potential, color: '#0870f7' },
          ].map(kpi => `
            <td style="width:20%;padding:5px;">
              <div style="border:1px solid #e2e8f0;border-radius:12px;padding:10px;text-align:center;">
                <div style="font-size:9px;color:#94a3b8;text-transform:uppercase;font-weight:bold;">${kpi.label}</div>
                <div style="font-size:16px;font-weight:bold;color:${kpi.color};margin-top:2px;">${kpi.value}</div>
              </div>
            </td>
          `).join('')}
        </tr></table>

        ${chartsRow}
        <div style="font-size:1px;line-height:1px;height:25px;">&nbsp;</div>
        <h2 style="color:#0870f7;font-size:15px;margin:25px 0 12px;padding-bottom:3px;border-bottom:1.5px solid #e2e8f0;">Áreas críticas para su atención</h2>
        ${areaCards}

        ${showTables ? `
        <br clear="all" style="mso-special-character:line-break;page-break-before:always;" />
        <h2>Desempeño por Áreas</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;margin-bottom:25px;">
          <thead><tr style="background:#f8fafc;border-bottom:1.5px solid #e2e8f0;">
            <th style="padding:10px;text-align:left;font-size:11px;color:#64748b;">Área Evaluada</th>
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;width:100px;">Tu Negocio</th>
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;width:120px;">Promedio Sector</th>
            <th style="padding:10px;text-align:left;font-size:11px;color:#64748b;">Análisis de Hallazgo</th>
          </tr></thead>
          <tbody>${areasRows}</tbody>
        </table>

        <h2>Proyección de Evolución</h2>
        <p style="margin-bottom:10px;">Puntaje estimado al implementar las recomendaciones estratégicas en los plazos defininedos.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:10px;border:1px solid #e2e8f0;">
          <tr style="background:#f8fafc;border-bottom:1.5px solid #e2e8f0;">
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;">Actual</th>
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;">3 meses</th>
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;">6 meses</th>
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;">12 meses</th>
          </tr>
          <tr>
            <td style="padding:15px 10px;text-align:center;font-weight:bold;color:#0f172a;font-size:14px;">${score}/100</td>
            <td style="padding:15px 10px;text-align:center;font-weight:bold;color:#0870f7;font-size:14px;">${p2}/100</td>
            <td style="padding:15px 10px;text-align:center;font-weight:bold;color:#0870f7;font-size:14px;">${p3}/100</td>
            <td style="padding:15px 10px;text-align:center;font-weight:bold;color:#0870f7;font-size:14px;">${p4}/100</td>
          </tr>
        </table>
        ` : ''}

        <h2>Análisis Estratégico General</h2>
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;color:#475569;font-size:12px;margin-bottom:25px;line-height:1.6;">
          ${(diagnostic.result.feedbackIa || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
        </div>

        <h2>Recomendaciones Estratégicas</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;margin-bottom:25px;">
          <thead><tr style="background:#f8fafc;border-bottom:1.5px solid #e2e8f0;">
            <th style="padding:10px;text-align:center;font-size:11px;color:#64748b;width:40px;">#</th>
            <th style="padding:10px;text-align:left;font-size:11px;color:#64748b;">Acciones y Beneficio Esperado</th>
          </tr></thead>
          <tbody>${recsRows}</tbody>
        </table>
      </div>
    </body>
    </html>
  `;
  return content;
}

export function downloadWord(diagnostic: any, chartImages?: ChartImages) {
  if (!diagnostic) return;

  const content = buildReportHtml(diagnostic, chartImages, 'word');

  const barChartRef = chartImages?.barChart ? 'file:///img_barChart.png' : '';
  const radarChartRef = chartImages?.radarChart ? 'file:///img_radarChart.png' : '';
  const lineChartRef = chartImages?.lineChart ? 'file:///img_lineChart.png' : '';

  // Package the content as MHTML to support inline base64 images inside Microsoft Word
  const boundary = '----=_NextPart_HUBSME_DIAGNOSTICO_MIME';
  
  let mhtml = `MIME-Version: 1.0\r\n`;
  mhtml += `Content-Type: multipart/related; boundary="${boundary}"; type="text/html"\r\n\r\n`;
  
  mhtml += `--${boundary}\r\n`;
  mhtml += `Content-Type: text/html; charset="utf-8"\r\n`;
  mhtml += `Content-Location: file:///main.html\r\n\r\n`;
  mhtml += content + `\r\n\r\n`;

  const addImagePart = (ref: string, dataUri: string | undefined) => {
    if (!dataUri) return;
    const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) return;
    const contentType = match[1];
    const base64Data = match[2];

    mhtml += `--${boundary}\r\n`;
    mhtml += `Content-Type: ${contentType}\r\n`;
    mhtml += `Content-Transfer-Encoding: base64\r\n`;
    mhtml += `Content-Location: ${ref}\r\n\r\n`;
    // Split base64 into lines of 76 characters for MIME compliance
    const wrappedBase64 = base64Data.replace(/(.{76})/g, '$1\r\n');
    mhtml += wrappedBase64 + `\r\n\r\n`;
  };

  if (barChartRef) addImagePart(barChartRef, chartImages?.barChart);
  if (radarChartRef) addImagePart(radarChartRef, chartImages?.radarChart);
  if (lineChartRef) addImagePart(lineChartRef, chartImages?.lineChart);

  mhtml += `--${boundary}--\r\n`;

  console.log('downloadWord: MHTML compiled successfully. Total length:', mhtml.length);

  const blob = new Blob([mhtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagnostico-${diagnostic.id}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the diagnostic report as PDF.
 * Reuses the same HTML template as downloadWord but renders it
 * in a hidden iframe and triggers the browser print dialog (Save as PDF).
 */
export function downloadPdf(diagnostic: any, chartImages?: ChartImages) {
  if (!diagnostic) return;

  // Re-use the same HTML generation logic by calling a shared builder
  const htmlContent = buildReportHtml(diagnostic, chartImages, 'pdf');

  // For PDF, replace MHTML image refs with inline base64 data URIs
  let pdfHtml = htmlContent;
  if (chartImages?.barChart) {
    pdfHtml = pdfHtml.replace(/file:\/\/\/img_barChart\.png/g, chartImages.barChart);
  }
  if (chartImages?.radarChart) {
    pdfHtml = pdfHtml.replace(/file:\/\/\/img_radarChart\.png/g, chartImages.radarChart);
  }
  if (chartImages?.lineChart) {
    pdfHtml = pdfHtml.replace(/file:\/\/\/img_lineChart\.png/g, chartImages.lineChart);
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '794px';   // A4 width at 96dpi
  iframe.style.height = '1123px'; // A4 height at 96dpi
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error('downloadPdf: could not access iframe document');
    document.body.removeChild(iframe);
    return;
  }

  iframeDoc.open();
  iframeDoc.write(pdfHtml);
  iframeDoc.close();

  // Wait for images to load before printing
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up after print dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
}
