#!/usr/bin/env node

/**
 * Local Test Verification Script
 * Tests all components locally before Render deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPermits, findPermitByNumber } from './server/services/permit-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║      LOCAL TEST VERIFICATION - DHA BACK OFFICE      ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    testsFailed++;
  }
}

// Test 1: Check if all files exist
test('Check required files', () => {
  const files = [
    'server/index.js',
    'server/config/secrets.js',
    'server/services/permit-service.js',
    'server/routes/permits.js',
    'package.json',
    'test-documents-display.html'
  ];
  
  files.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, file))) {
      throw new Error(`Missing: ${file}`);
    }
  });
});

// Test 2: Check package.json
test('Verify package.json', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  if (!pkg.dependencies.express) throw new Error('Missing express');
  if (!pkg.dependencies.cors) throw new Error('Missing cors');
  if (!pkg.dependencies.helmet) throw new Error('Missing helmet');
});

// Test 3: Load and verify permits
test('Verify 13 documents loaded', () => {
  const permits = getAllPermits();
  if (permits.length !== 13) {
    throw new Error(`Expected 13 permits, got ${permits.length}`);
  }
});

// Test 4: Find Muhammad Mohsin
test('Verify Muhammad Mohsin (PR)', () => {
  const permit = findPermitByNumber('PRP/5829/2025 JHB');
  if (!permit) throw new Error('Permit not found');
  if (permit.applicantName !== 'Muhammad Mohsin') throw new Error('Wrong applicant');
  if (permit.passportNumber !== 'AD0110994') throw new Error('Wrong passport - should be AD0110994');
});

// Test 5: Find Refugee Certificate
test('Verify FAATI ABDURAHMAN ISA (Refugee)', () => {
  const permit = findPermitByNumber('REF/PTA/2025/10/13001');
  if (!permit) throw new Error('Permit not found');
  if (permit.applicantName !== 'FAATI ABDURAHMAN ISA') throw new Error('Wrong applicant');
  if (permit.permitType !== 'Refugee Certificate') throw new Error('Wrong permit type');
});

// Test 6: Check HTML display file
test('Verify HTML display file', () => {
  const htmlFile = path.join(__dirname, 'test-documents-display.html');
  const content = fs.readFileSync(htmlFile, 'utf8');
  if (!content.includes('Muhammad Mohsin')) throw new Error('Missing Muhammad Mohsin');
  if (!content.includes('AD0110994')) throw new Error('Missing AD0110994');
  if (!content.includes('FAATI ABDURAHMAN ISA')) throw new Error('Missing FAATI ABDURAHMAN ISA');
});

// Test 7: Check server configuration (sync version)
test('Verify server config', () => {
  try {
    const configContent = fs.readFileSync(path.join(__dirname, 'server/config/secrets.js'), 'utf8');
    if (!configContent.includes('port: 3000') && !configContent.includes("port: process.env.PORT")) {
      throw new Error('Port configuration not found');
    }
  } catch (e) {
    throw new Error(`Config check failed: ${e.message}`);
  }
});

// Test 8: Verify document distribution
test('Verify all 13 documents in system', () => {
  const permits = getAllPermits();
  const types = {};
  
  permits.forEach(p => {
    types[p.permitType] = (types[p.permitType] || 0) + 1;
  });
  
  if (types['Permanent Residence'] !== 8) throw new Error('Should have 8 PR documents');
  if (types['Work Permit'] !== 1) throw new Error('Should have 1 WP document');
  if (types['Refugee Certificate'] !== 1) throw new Error('Should have 1 RC document');
});

// Summary
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║                   TEST SUMMARY                       ║');
console.log('╠══════════════════════════════════════════════════════╣');
console.log(`║ Passed: ✅ ${testsPassed.toString().padEnd(46)} ║`);
console.log(`║ Failed: ${testsFailed === 0 ? '✅ ' : '❌ '}${testsFailed.toString().padEnd(45)} ║`);
console.log('╠══════════════════════════════════════════════════════╣');

if (testsFailed === 0) {
  console.log('║            ✅ ALL TESTS PASSED - READY TO             ║');
  console.log('║              DEPLOY TO RENDER PLATFORM               ║');
} else {
  console.log('║            ❌ SOME TESTS FAILED - FIX ERRORS          ║');
}

console.log('╚══════════════════════════════════════════════════════╝\n');

// Test URLs that will be available
console.log('📋 TEST ENDPOINTS AVAILABLE AT:\n');
console.log('   Health Check:          http://localhost:3000/api/health');
console.log('   All Documents:         http://localhost:3000/api/permits');
console.log('   Permanent Residence:   http://localhost:3000/api/permits/1');
console.log('   Refugee Certificate:   http://localhost:3000/api/permits/13');
console.log('   PR PDF:                http://localhost:3000/api/permits/1/pdf');
console.log('   Refugee PDF:           http://localhost:3000/api/permits/13/pdf');
console.log('\n   HTML Display Test:     Open test-documents-display.html in browser\n');

process.exit(testsFailed > 0 ? 1 : 0);
