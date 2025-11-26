#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🧪 Running JewelAura Test Suite...\n');

// Backend Tests
console.log('📦 Running Backend Tests...');
try {
  if (existsSync('./api/package.json')) {
    process.chdir('./api');
    execSync('npm install', { stdio: 'inherit' });
    execSync('npm test', { stdio: 'inherit' });
    process.chdir('..');
    console.log('✅ Backend tests passed!\n');
  }
} catch (error) {
  console.log('❌ Backend tests failed!\n');
  process.exit(1);
}

// Frontend Tests
console.log('🎨 Running Frontend Tests...');
try {
  if (existsSync('./front_end/package.json')) {
    process.chdir('./front_end');
    execSync('npm install --legacy-peer-deps --force', { stdio: 'inherit' });
    execSync('npm test', { stdio: 'inherit' });
    process.chdir('..');
    console.log('✅ Frontend tests passed!\n');
  }
} catch (error) {
  console.log('❌ Frontend tests failed!\n');
  process.exit(1);
}

console.log('🎉 All tests passed successfully!');