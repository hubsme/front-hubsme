const fs = require('fs');
const path = require('path');

// Directorio objetivo a escanear
const targetDir = path.join(__dirname, '../src/modules');

// Prefijos de utilidades de color en Tailwind
const prefixes = [
  'text', 'bg', 'border', 'ring', 'divide', 
  'from', 'via', 'to', 'fill', 'stroke', 
  'shadow', 'outline', 'decoration', 'accent', 'caret'
];

// Colores nativos de Tailwind que queremos evitar
const forbiddenColors = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose', 'white', 'black'
];

// Expresión regular para detectar clases (ej. text-slate-500, hover:bg-red-500/50, border-white)
// Se asegura de encontrar un prefijo, seguido de un color prohibido, opcionalmente su peso (-500) y opcionalmente su opacidad (/50)
const regexStr = `\\b(?:${prefixes.join('|')})-(?:${forbiddenColors.join('|')})(?:-\\d{2,3})?(?:\\/\\[?\\d*\\.?\\d*%?\\]?)?\\b`;
const colorRegex = new RegExp(regexStr, 'g');
const darkRegex = /\bdark:[a-zA-Z0-9\-\/\[\]\.]+\b/g;

let totalIssues = 0;
let filesWithIssues = 0;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ El directorio ${dir} no existe.`);
    return;
  }
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function checkFile(filePath) {
  // Solo revisar archivos HTML
  if (!filePath.endsWith('.html')) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let fileHasIssue = false;

  lines.forEach((line, index) => {
    let match;
    // Reseteamos lastIndex por si acaso, ya que la usamos en un bucle
    colorRegex.lastIndex = 0;
    
    // Buscar todas las coincidencias en la línea actual
    const colorMatches = [...line.matchAll(colorRegex)];
    const darkMatches = [...line.matchAll(darkRegex)];
    
    // Unir todas las coincidencias encontradas
    const matches = [...colorMatches, ...darkMatches];
    
    if (matches.length > 0) {
      if (!fileHasIssue) {
        console.log(`\n📄 Archivo: \x1b[36m${filePath.replace(path.join(__dirname, '../'), '')}\x1b[0m`);
        fileHasIssue = true;
        filesWithIssues++;
      }
      
      matches.forEach(m => {
        // Recortamos la línea para no imprimir excesos de espacios
        const trimmedLine = line.trim().substring(0, 100) + (line.length > 100 ? '...' : '');
        console.log(`   Línea ${String(index + 1).padStart(3, ' ')}: Encontrado \x1b[31m${m[0]}\x1b[0m -> \x1b[90m${trimmedLine}\x1b[0m`);
        totalIssues++;
      });
    }
  });
}

console.log('\n🔍 Escaneando archivos HTML en src/modules en busca de colores nativos de Tailwind...');
walkDir(targetDir, checkFile);

console.log('\n=============================================================');
if (totalIssues > 0) {
  console.log(`⚠️  Se encontraron \x1b[31m${totalIssues}\x1b[0m usos de colores nativos o clases dark: en \x1b[31m${filesWithIssues}\x1b[0m archivos.`);
  console.log(`💡 Considera reemplazarlos con los colores de tu styles.css y evita usar 'dark:' ya que el tema cambia automáticamente por variables.`);
  console.log(`   (ej. text-primary-500, bg-surface, text-muted, bg-accent-200, etc.)`);
} else {
  console.log('✅ ¡Excelente! No se encontraron colores nativos ni clases dark:. Todo está usando el tema personalizado y fluido.');
}
console.log('=============================================================\n');
