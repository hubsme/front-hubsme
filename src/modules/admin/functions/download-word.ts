function formatDate(value: string | Date | null | undefined): string {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function downloadWord(diagnostic: any) {
  if (!diagnostic) return;

  const score = diagnostic.score ?? 50;
  const priority = score < 60 ? 'Alta' : (score < 75 ? 'Media' : 'Baja');
  const priorityColor = score < 60 ? '#f05252' : (score < 75 ? '#c27803' : '#0e9f6e');
  const badgeText = score < 60 ? 'Atención prioritaria' : (score < 75 ? 'Mejora continua' : 'Mantener nivel');
  const potential = score < 60 ? 'Alto' : (score < 75 ? 'Medio' : 'Bajo');

  // Desempeño por áreas rows
  let areasTableRows = '';
  for (const area of diagnostic.result.areasEvaluadas || []) {
    const name = area.area.toLowerCase();
    const avg = name.includes('finan') ? 60 : (name.includes('operac') ? 55 : (name.includes('equip') || name.includes('organi') ? 65 : 58));
    areasTableRows += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #1e293b; font-size: 12px;">${area.area}</td>
        <td style="padding: 10px; color: #0870f7; font-weight: bold; text-align: center; font-size: 12px;">${area.puntaje}/100</td>
        <td style="padding: 10px; color: #64748b; text-align: center; font-size: 12px;">${avg}/100</td>
        <td style="padding: 10px; color: #475569; font-size: 12px;">${area.hallazgo}</td>
      </tr>
    `;
  }

  // Detailed Area Cards (with descriptions and colored mini-bars)
  let detailedAreaCards = '';
  for (const area of diagnostic.result.areasEvaluadas || []) {
    const name = area.area.toLowerCase();
    let color = '#0870f7'; // finanzas
    let desc = 'Mejora tu rentabilidad y flujo de caja.';
    if (name.includes('operac')) {
      color = '#0e9f6e';
      desc = 'Optimiza procesos and eleva la eficiencia.';
    } else if (name.includes('equip') || name.includes('organi')) {
      color = '#c27803';
      desc = 'Fortalece capacidades y alineación del equipo.';
    } else if (name.includes('merca') || name.includes('comerc')) {
      color = '#7e3af2';
      desc = 'Aprovecha oportunidades y crece con foco.';
    }

    detailedAreaCards += `
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; font-size: 13px; color: ${color};">${area.area}</td>
            <td style="text-align: right; font-weight: bold; font-size: 13px; color: ${color};">${area.puntaje}/100</td>
          </tr>
        </table>
        <div style="background-color: #f1f5f9; height: 6px; border-radius: 3px; margin: 10px 0; overflow: hidden;">
          <div style="background-color: ${color}; height: 6px; width: ${area.puntaje}%;"></div>
        </div>
        <p style="margin: 5px 0 0 0; font-size: 11px; color: #64748b;">${desc}</p>
      </div>
    `;
  }

  // Recommendations Rows
  let recsHtml = '';
  let idx = 1;
  for (const rec of diagnostic.result.recomendaciones || []) {
    recsHtml += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #0e9f6e; text-align: center; width: 30px; font-size: 12px;">${idx++}</td>
        <td style="padding: 10px; font-size: 12px;">
          <div style="font-weight: bold; color: #1e293b; margin-bottom: 3px;">${rec.accion}</div>
          <div style="font-size: 11px; color: #64748b;"><strong>Beneficio esperado:</strong> ${rec.beneficioEsperado}</div>
        </td>
      </tr>
    `;
  }

  // Evolution projection table
  const p2 = Math.min(100, Math.round(score + (100 - score) * 0.15));
  const p3 = Math.min(100, Math.round(score + (100 - score) * 0.3));
  const p4 = Math.min(100, Math.round(score + (100 - score) * 0.5));
  const evolutionTable = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #e2e8f0;">
      <tr style="background-color: #f8fafc; border-bottom: 1.5px solid #e2e8f0;">
        <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b;">Actual</th>
        <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b;">3 meses</th>
        <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b;">6 meses</th>
        <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b;">12 meses</th>
      </tr>
      <tr>
        <td style="padding: 15px 10px; text-align: center; font-weight: bold; color: #0f172a; font-size: 14px;">${score}/100</td>
        <td style="padding: 15px 10px; text-align: center; font-weight: bold; color: #0870f7; font-size: 14px;">${p2}/100</td>
        <td style="padding: 15px 10px; text-align: center; font-weight: bold; color: #0870f7; font-size: 14px;">${p3}/100</td>
        <td style="padding: 15px 10px; text-align: center; font-weight: bold; color: #0870f7; font-size: 14px;">${p4}/100</td>
      </tr>
    </table>
  `;

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Diagnóstico Empresarial - Hubsme</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; padding: 20px; }
        .report-container { max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; }
        h1 { color: #0f172a; font-size: 24px; margin-top: 0; margin-bottom: 5px; }
        h2 { color: #0f172a; font-size: 16px; margin-top: 25px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #e2e8f0; }
        p { font-size: 13px; color: #475569; }
      </style>
    </head>
    <body>
      <div class="report-container">
        <!-- Hero Card Section -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 25px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; background-color: #ebf1f9; color: #0870f7; font-size: 10px; font-weight: bold; text-transform: uppercase;">Diagnóstico Completado</span>
                <h1 style="font-size: 20px; margin: 8px 0; color: #0f172a;">Tu informe estratégico está listo</h1>
                <p style="margin: 0; font-size: 12px; color: #64748b;">Resumen ejecutivo de la salud y oportunidades de tu negocio.</p>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #94a3b8;">Fecha: ${formatDate(diagnostic.createdAt)}</p>
              </td>
              <td style="width: 120px; text-align: center; vertical-align: middle; background-color: #f8fafc; border-radius: 12px; padding: 15px;">
                <div style="font-size: 28px; font-weight: bold; color: #0f172a; line-height: 1;">${score}</div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">/100</div>
                <div style="margin-top: 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: ${priorityColor};">${badgeText}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- KPI Cards Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td style="width: 20%; padding: 5px;">
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Puntaje Global</div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px;">${score}/100</div>
              </div>
            </td>
            <td style="width: 20%; padding: 5px;">
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Prioridad</div>
                <div style="font-size: 16px; font-weight: bold; color: ${priorityColor}; margin-top: 2px;">${priority}</div>
              </div>
            </td>
            <td style="width: 20%; padding: 5px;">
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Áreas</div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px;">${diagnostic.result.areasEvaluadas.length}</div>
              </div>
            </td>
            <td style="width: 20%; padding: 5px;">
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Recomendac.</div>
                <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px;">${diagnostic.result.recomendaciones.length}</div>
              </div>
            </td>
            <td style="width: 20%; padding: 5px;">
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: bold;">Mejora</div>
                <div style="font-size: 16px; font-weight: bold; color: #0870f7; margin-top: 2px;">${potential}</div>
              </div>
            </td>
          </tr>
        </table>

        <h2>Desempeño por Áreas</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1.5px solid #e2e8f0;">
              <th style="padding: 10px; text-align: left; font-size: 11px; color: #64748b;">Área Evaluada</th>
              <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b; width: 100px;">Tu Negocio</th>
              <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b; width: 120px;">Promedio Sector</th>
              <th style="padding: 10px; text-align: left; font-size: 11px; color: #64748b;">Análisis de Hallazgo</th>
            </tr>
          </thead>
          <tbody>
            ${areasTableRows}
          </tbody>
        </table>

        <h2>Capacidades Detalladas</h2>
        ${detailedAreaCards}

        <h2>Proyección de Evolución</h2>
        <p style="margin-bottom: 10px;">Puntaje estimado al implementar las recomendaciones estratégicas en los plazos definidos.</p>
        ${evolutionTable}

        <h2>Análisis Estratégico General</h2>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; color: #475569; font-size: 12px; margin-bottom: 25px; line-height: 1.6;">
          ${(diagnostic.result.feedbackIa || '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')}
        </div>

        <h2>Recomendaciones Estratégicas</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1.5px solid #e2e8f0;">
              <th style="padding: 10px; text-align: center; font-size: 11px; color: #64748b; width: 40px;">#</th>
              <th style="padding: 10px; text-align: left; font-size: 11px; color: #64748b;">Acciones y Beneficio Esperado</th>
            </tr>
          </thead>
          <tbody>
            ${recsHtml}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

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
