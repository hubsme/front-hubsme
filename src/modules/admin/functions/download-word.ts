function formatDate(value: string | Date | null | undefined): string {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface ChartImages { barChart?: string; radarChart?: string; lineChart?: string }

export function downloadWord(diagnostic: any, chartImages?: ChartImages) {
  if (!diagnostic) return;

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
    operac: { color: '#0e9f6e', desc: 'Optimiza procesos y eleva la eficiencia.' },
    equip: { color: '#c27803', desc: 'Fortalece capacidades y alineación del equipo.' },
    organi: { color: '#c27803', desc: 'Fortalece capacidades y alineación del equipo.' },
    merca: { color: '#7e3af2', desc: 'Aprovecha oportunidades y crece con foco.' },
    comerc: { color: '#7e3af2', desc: 'Aprovecha oportunidades y crece con foco.' },
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

  const chartsRow = hasCharts ? `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        ${chartKeys.map((key, i) => `
          <td style="width:33.3%;padding:5px;vertical-align:top;">
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:8px;background:#fff;">
              <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;margin-bottom:6px;">${chartLabels[i]}</div>
              ${chartImages?.[key] ? `<img src="${chartImages[key]}" style="width:100%;border-radius:8px;" />` : '<div style="height:160px;background:#f8fafc;border-radius:8px;"></div>'}
            </div>
          </td>
        `).join('')}
      </tr>
    </table>
  ` : '';

  // Area cards row
  const areaCards = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        ${(diagnostic.result.areasEvaluadas || []).map((area: { area: string; puntaje: number }) => {
          const { color, desc } = getAreaStyle(area.area);
          return `
            <td style="width:25%;padding:5px;vertical-align:top;">
              <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#fff;">
                <table style="width:100%;border-collapse:collapse;"><tr>
                  <td style="font-weight:bold;font-size:12px;color:#1e293b;">${area.area}</td>
                  <td style="text-align:right;font-weight:bold;font-size:12px;color:${color};">${area.puntaje}<span style="font-size:9px;color:#94a3b8;">/100</span></td>
                </tr></table>
                <div style="background:#f1f5f9;height:5px;border-radius:3px;margin:8px 0;overflow:hidden;">
                  <div style="background:${color};height:5px;width:${area.puntaje}%;"></div>
                </div>
                <p style="margin:4px 0 0;font-size:9px;color:#64748b;">${desc}</p>
              </div>
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
        ${areaCards}

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
        <p style="margin-bottom:10px;">Puntaje estimado al implementar las recomendaciones estratégicas en los plazos definidos.</p>
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

  // Use base64 data URIs directly in the HTML — no MHTML needed
  const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagnostico-${diagnostic.id}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
