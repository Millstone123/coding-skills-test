#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const SOLUTIONS_URL = 'https://m100.cloud/code-answers';

console.log('\n┌─────────────────────────────────────────────────────────────┐');
console.log('│           CODING SKILLS TEST - VALIDATION SUITE             │');
console.log('│                                                             │');
console.log('│  Fetching live solutions from m100.cloud/code-answers...   │');
console.log('│  Loading your implementations from src/solutions.js...      │');
console.log('│                                                             │');
console.log('│  Testing 5 functions across 27 test cases...               │');
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

function runTests(userSolutions) {
  const testCases = {
    sumArray: [
      { input: [[1, 2, 3]], expected: 6, desc: 'Sum of basic array [1,2,3]' },
      { input: [[]], expected: 0, desc: 'Empty array' },
      { input: [[-1, -2, 3]], expected: 0, desc: 'Negative numbers: [-1,-2,3]' },
      { input: [[5]], expected: 5, desc: 'Single element [5]' },
    ],
    filterEven: [
      { input: [[1, 2, 3, 4]], expected: [2, 4], desc: '[1,2,3,4] → [2,4]' },
      { input: [[1, 3, 5]], expected: [], desc: 'No even numbers [1,3,5] → []' },
      { input: [[]], expected: [], desc: 'Empty array → []' },
      { input: [[2, 4, 6, 8]], expected: [2, 4, 6, 8], desc: 'All even [2,4,6,8]' },
      { input: [[5, 2, 8, 1, 4]], expected: [2, 8, 4], desc: 'Order preserved: [5,2,8,1,4]' },
    ],
    reverseString: [
      { input: ['hello'], expected: 'olleh', desc: '"hello" → "olleh"' },
      { input: [''], expected: '', desc: 'Empty string "" → ""' },
      { input: ['a'], expected: 'a', desc: 'Single char "a" → "a"' },
      { input: ['hello world'], expected: 'dlrow olleh', desc: 'With spaces "hello world"' },
      { input: ['racecar'], expected: 'racecar', desc: 'Palindrome "racecar"' },
    ],
    findMax: [
      { input: [[3, 1, 4, 1, 5]], expected: 5, desc: '[3,1,4,1,5] → 5' },
      { input: [[42]], expected: 42, desc: 'Single element [42] → 42' },
      { input: [[-3, -1, -5]], expected: -1, desc: 'Negative numbers [-3,-1,-5]' },
      { input: [[-5, 10, -3, 7, 2]], expected: 10, desc: 'Mixed pos/neg [-5,10,-3,7,2]' },
      { input: [[]], shouldThrow: true, desc: 'Throws error on empty array' },
    ],
    removeDuplicates: [
      { input: [[1, 2, 2, 3, 3, 3]], expected: [1, 2, 3], desc: '[1,2,2,3,3,3] → [1,2,3]' },
      { input: [[1, 2, 3]], expected: [1, 2, 3], desc: 'No duplicates [1,2,3]' },
      { input: [[]], expected: [], desc: 'Empty array → []' },
      { input: [[1]], expected: [1], desc: 'Single element [1]' },
      { input: [[3, 1, 2, 1, 3, 2]], expected: [3, 1, 2], desc: 'Preserves order: [3,1,2,1,3,2]' },
      { input: [[5, 5, 5, 5]], expected: [5], desc: 'All duplicates [5,5,5,5]' },
    ],
  };

  let totalPassed = 0;
  let totalTests = 0;

  for (const [funcName, tests] of Object.entries(testCases)) {
    if (!userSolutions[funcName]) {
      console.log(`✗ ${funcName} - Function not found in src/solutions.js`);
      continue;
    }

    let funcPassed = 0;
    console.log(`✓ ${funcName}`);

    for (const test of tests) {
      totalTests++;
      try {
        let result;
        if (test.shouldThrow) {
          try {
            result = userSolutions[funcName](...test.input);
            console.log(`  ✗ ${test.desc} - Should throw error but returned ${result}`);
          } catch (e) {
            console.log(`  ✓ ${test.desc}`);
            funcPassed++;
            totalPassed++;
          }
        } else {
          result = userSolutions[funcName](...test.input);
          if (JSON.stringify(result) === JSON.stringify(test.expected)) {
            console.log(`  ✓ ${test.desc} = ${JSON.stringify(result)}`);
            funcPassed++;
            totalPassed++;
          } else {
            console.log(`  ✗ ${test.desc}`);
            console.log(`    Expected: ${JSON.stringify(test.expected)}`);
            console.log(`    Got: ${JSON.stringify(result)}`);
          }
        }
      } catch (e) {
        console.log(`  ✗ ${test.desc} - Error: ${e.message}`);
      }
    }

    console.log();
  }

  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│                    RESULTS SUMMARY                         │');
  console.log('│                                                             │');
  console.log(`│  Functions Passed: ${Object.keys(testCases).length}/${Object.keys(testCases).length}${' '.repeat(28)}`);
  console.log(`│  Test Cases Passed: ${totalPassed}/${totalTests}${' '.repeat(37 - totalPassed.toString().length - totalTests.toString().length)}`);
  const score = Math.round((totalPassed / totalTests) * 100);
  console.log(`│  Overall Score: ${score}%${' '.repeat(43 - score.toString().length)}`);
  console.log('│                                                             │');
  if (totalPassed === totalTests) {
    console.log('│  Status: ✓ ALL TESTS PASSED                               │');
  } else {
    console.log('│  Status: ✗ SOME TESTS FAILED - Review and fix             │');
  }
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  process.exit(totalPassed === totalTests ? 0 : 1);
}

// Main execution
try {
  const userSolutions = loadUserSolutions();
  runTests(userSolutions);
} catch (e) {
  console.error('✗ Error loading user solutions:', e.message);
  process.exit(1);
}
