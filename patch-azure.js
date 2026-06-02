const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'node_modules', '@azure', 'communication-react', 'package.json');

if (fs.existsSync(targetPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (pkg.exports && pkg.exports['.']) {
      const dot = pkg.exports['.'];
      let modified = false;
      if (dot.main) {
        dot.require = dot.main;
        delete dot.main;
        modified = true;
      }
      if (dot.module) {
        dot.import = dot.module;
        delete dot.module;
        modified = true;
      }
      if (modified) {
        fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2), 'utf8');
        console.log('Successfully patched @azure/communication-react exports!');
      } else {
        console.log('@azure/communication-react exports are already correct.');
      }
    }
  } catch (err) {
    console.error('Failed to patch @azure/communication-react package.json:', err);
  }
} else {
  console.log('@azure/communication-react package.json not found at:', targetPath);
}
