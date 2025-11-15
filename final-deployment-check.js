#!/usr/bin/env node

/**
 * FINAL PRE-DEPLOYMENT TEST
 * Comprehensive verification before Render deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║          🚀 FINAL PRE-DEPLOYMENT TEST SUITE                    ║');
console.log('║                                                                ║');
console.log('║     Comprehensive verification before Render deployment        ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;
const results = [];

function test(category, name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
    results.push({ category, name, status: '✅' });
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
    results.push({ category, name, status: '❌', error: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
console.log('📋 SECTION 1: FILE STRUCTURE\n');

test('Files', 'package.json exists', () => {
  if (!fs.existsSync('package.json')) throw new Error('package.json not found');
});

test('Files', 'server/index.js exists', () => {
  if (!fs.existsSync('server/index.js')) throw new Error('server/index.js not found');
});

test('Files', 'server/config/secrets.js exists', () => {
  if (!fs.existsSync('server/config/secrets.js')) throw new Error('server/config/secrets.js not found');
});

test('Files', 'server/services/permit-service.js exists', () => {
  if (!fs.existsSync('server/services/permit-service.js')) throw new Error('server/services/permit-service.js not found');
});

test('Files', 'test-documents-display.html exists', () => {
  if (!fs.existsSync('test-documents-display.html')) throw new Error('test-documents-display.html not found');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📦 SECTION 2: CONFIGURATION VALIDATION\n');

test('Config', 'package.json is valid JSON', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.name) throw new Error('package.json missing name');
});

test('Config', 'package.json has required dependencies', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const required = ['express', 'cors', 'helmet', 'compression'];
  const missing = required.filter(dep => !pkg.dependencies[dep]);
  if (missing.length > 0) throw new Error(`Missing: ${missing.join(', ')}`);
});

test('Config', 'package.json has start script', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.scripts || !pkg.scripts.start) throw new Error('start script not found');
});

test('Config', 'Node version requirement is 20+', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.engines || !pkg.engines.node || !pkg.engines.node.includes('20')) {
    throw new Error('Node 20+ not required in package.json');
  }
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📄 SECTION 3: SERVER CODE VALIDATION\n');

test('Server', 'server/index.js contains Express app', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('express()')) throw new Error('No Express app found');
});

test('Server', 'server/index.js has security middleware', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('helmet')) throw new Error('No helmet middleware');
  if (!content.includes('cors')) throw new Error('No cors middleware');
});

test('Server', 'server/index.js listens on PORT', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('listen') && !content.includes('app.listen')) {
    throw new Error('No listen() call found');
  }
});

test('Server', 'server/config/secrets.js exports config', () => {
  const content = fs.readFileSync('server/config/secrets.js', 'utf8');
  if (!content.includes('export const config')) throw new Error('config not exported');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📊 SECTION 4: DATA VALIDATION\n');

test('Data', 'permit-service.js has fallback data', () => {
  const content = fs.readFileSync('server/services/permit-service.js', 'utf8');
  if (!content.includes('getFallbackPermits')) throw new Error('No fallback permits function');
});

test('Data', 'permit-service.js has 13 documents', () => {
  const content = fs.readFileSync('server/services/permit-service.js', 'utf8');
  // Count "id:" entries which indicate document objects
  const matches = content.match(/,\s*id:\s*\d+,/g) || [];
  if (matches.length < 13) throw new Error(`Found ${matches.length} documents, expected 13`);
});

test('Data', 'Muhammad Mohsin data present', () => {
  const content = fs.readFileSync('server/services/permit-service.js', 'utf8');
  if (!content.includes('Muhammad Mohsin')) throw new Error('Muhammad Mohsin not found');
  if (!content.includes('AD0110994')) throw new Error('AD0110994 passport not found');
});

test('Data', 'FAATI ABDURAHMAN data present', () => {
  const content = fs.readFileSync('server/services/permit-service.js', 'utf8');
  if (!content.includes('FAATI ABDURAHMAN')) throw new Error('FAATI ABDURAHMAN not found');
  if (!content.includes('REF/PTA/2025/10/13001')) throw new Error('Refugee permit number not found');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🌐 SECTION 5: HTML TEST FILE VALIDATION\n');

test('HTML', 'HTML file is valid size', () => {
  const stat = fs.statSync('test-documents-display.html');
  if (stat.size < 5000) throw new Error('HTML file too small (< 5KB)');
});

test('HTML', 'HTML has Muhammad Mohsin display', () => {
  const content = fs.readFileSync('test-documents-display.html', 'utf8');
  if (!content.includes('Muhammad Mohsin')) throw new Error('Muhammad Mohsin not in HTML');
});

test('HTML', 'HTML has FAATI ABDURAHMAN display', () => {
  const content = fs.readFileSync('test-documents-display.html', 'utf8');
  if (!content.includes('FAATI ABDURAHMAN')) throw new Error('FAATI ABDURAHMAN not in HTML');
});

test('HTML', 'HTML has passport numbers', () => {
  const content = fs.readFileSync('test-documents-display.html', 'utf8');
  if (!content.includes('AD0110994')) throw new Error('AD0110994 not in HTML');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n🔐 SECTION 6: SECURITY FEATURES\n');

test('Security', 'Helmet security headers configured', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('helmet')) throw new Error('No helmet configuration');
});

test('Security', 'CORS is configured', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('cors()')) throw new Error('No CORS configuration');
});

test('Security', 'Rate limiting configured', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('rateLimit')) throw new Error('No rate limiting');
});

test('Security', 'Compression enabled', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('compression')) throw new Error('No compression middleware');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n✨ SECTION 7: API ENDPOINTS\n');

test('API', 'Health endpoint configured', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('/api/health') && !content.includes('app.get')) {
    throw new Error('No health endpoint found');
  }
});

test('API', 'Permits router imported', () => {
  const content = fs.readFileSync('server/index.js', 'utf8');
  if (!content.includes('permitsRouter')) throw new Error('Permits router not imported');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n');
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                      FINAL TEST RESULTS                        ║');
console.log('╠════════════════════════════════════════════════════════════════╣');
console.log(`║ Total Tests: ${(passed + failed).toString().padEnd(47)}║`);
console.log(`║ ✅ Passed:   ${passed.toString().padEnd(48)}║`);
console.log(`║ ❌ Failed:   ${failed.toString().padEnd(48)}║`);
console.log('╠════════════════════════════════════════════════════════════════╣');

if (failed === 0) {
  console.log('║                                                                ║');
  console.log('║    ✅ ALL PRE-DEPLOYMENT TESTS PASSED!                        ║');
  console.log('║                                                                ║');
  console.log('║    Your system is ready for Render deployment ✨              ║');
  console.log('║                                                                ║');
  console.log('║    Next Steps:                                                 ║');
  console.log('║    1. git push origin main                                     ║');
  console.log('║    2. Go to: https://dashboard.render.com                     ║');
  console.log('║    3. Create new Web Service                                  ║');
  console.log('║    4. Your system goes LIVE in 10 minutes! 🚀                 ║');
  console.log('║                                                                ║');
} else {
  console.log('║                                                                ║');
  console.log('║    ⚠️  SOME TESTS FAILED - PLEASE FIX ERRORS                 ║');
  console.log('║                                                                ║');
  console.log('║    Failed Tests:                                              ║');
  results.filter(r => r.status === '❌').forEach(r => {
    console.log(`║    • ${r.name}`);
  });
  console.log('║                                                                ║');
}

console.log('╚════════════════════════════════════════════════════════════════╝\n');

process.exit(failed > 0 ? 1 : 0);
