import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const candidateAssetPaths = [
  path.join(PROJECT_ROOT, 'attached_assets'),
  path.join(PROJECT_ROOT, '..', 'attached_assets'),
  '/opt/render/project/attached_assets',
  '/opt/render/project/src/attached_assets',
  path.join(process.cwd(), 'attached_assets')
];

console.log('Predeploy asset check:');
let found = null;
for (const p of candidateAssetPaths) {
  try {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      console.log('  ✅ Found assets at:', p);
      if (fs.existsSync(path.join(p, 'index.html'))) {
        console.log('  ✅ index.html is present');
        found = p;
        break;
      } else {
        console.warn('  ⚠️ index.html not found at:', p);
      }
    } else {
      console.log('  ℹ️ not found:', p);
    }
  } catch (e) {
    console.error('  ❌ Error checking path:', p, e.message);
  }
}

if (!found) {
  console.error('ERROR: No attached_assets path with index.html was found. Predeploy test failed.');
  console.error('Candidate paths: ', candidateAssetPaths);
  process.exit(2);
} else {
  console.log('Predeploy test passed - assets verified.');
  process.exit(0);
}
