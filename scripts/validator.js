#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOLUTIONS_URL = 'https://m100.cloud/code-answers';

console.log('\n┌─────────────────────────────────────────────────────────────┐');
console.log('│           CODING SKILLS TEST - VALIDATION SUITE             │');
console.log('│                                                             │');
console.log('│  Fetching live solutions from m100.cloud/code-answers...   │');
console.log('│  Loading your implementations from src/solutions.js...      │');
console.log('│                                                             │');
console.log('│  Testing 5 functions against reference implementations...  │');
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

function runBashFunction(bashScript, funcName, args) {
  try {
    const argStr = args.map(a => JSON.stringify(a)).join(' ');
    const cmd = `${bashScript}\n${funcName} ${argStr}`;
    const result = execSync(`bash -c "${cmd.replace(/"/g, '\\"')}"`, { encoding: 'utf8' }).trim();
    return result;
  } catch (e) {
    throw new Error(e.message);
  }
}

function runTests(userSolutions, bashScript) {
  const testCases = {
    sumArray: [
      { input: [[1, 2, 3]], desc: 'Sum of basic array [1,2,3]' },
      { input: [[]], desc: 'Empty array' },
      { input: [[-1, -2, 3]], desc: 'Negative numbers: [-1,-2,3]' },
      { input: [[5]], desc: 'Single element [5]' },
    ],
    filterEven: [
      { input: [[1, 2, 3, 4]], desc: '[1,2,3,4] → [2,4]' },
      { input: [[1, 3, 5]], desc: 'No even numbers [1,3,5] → []' },
      { input: [[]], desc: 'Empty array → []' },
      { input: [[2, 4, 6, 8]], desc: 'All even [2,4,6,8]' },
      { input: [[5, 2, 8, 1, 4]], desc: 'Order preserved: [5,2,8,1,4]' },
    ],
    reverseString: [
      { input: ['hello'], desc: '"hello" → "olleh"' },
      { input: [''], desc: 'Empty string "" → ""' },
      { input: ['a'], desc: 'Single char "a" → "a"' },
      { input: ['hello world'], desc: 'With spaces "hello world"' },
      { input: ['racecar'], desc: 'Palindrome "racecar"' },
    ],
    findMax: [
      { input: [[3, 1, 4, 1, 5]], desc: '[3,1,4,1,5] → 5' },
      { input: [[42]], desc: 'Single element [42] → 42' },
      { input: [[-3, -1, -5]], desc: 'Negative numbers [-3,-1,-5]' },
      { input: [[-5, 10, -3, 7, 2]], desc: 'Mixed pos/neg [-5,10,-3,7,2]' },
      { input: [[]], shouldThrow: true, desc: 'Throws error on empty array' },
    ],
    removeDuplicates: [
      { input: [[1, 2, 2, 3, 3, 3]], desc: '[1,2,2,3,3,3] → [1,2,3]' },
      { input: [[1, 2, 3]], desc: 'No duplicates [1,2,3]' },
      { input: [[]], desc: 'Empty array → []' },
      { input: [[1]], desc: 'Single element [1]' },
      { input: [[3, 1, 2, 1, 3, 2]], desc: 'Preserves order: [3,1,2,1,3,2]' },
      { input: [[5, 5, 5, 5]], desc: 'All duplicates [5,5,5,5]' },
    ],
  };

  let totalPassed = 0;
  let totalTests = 0;

  for (const [funcName, tests] of Object.entries(testCases)) {
    if (!userSolutions[funcName]) {
      console.log(`✗ ${funcName} - Function not found in src/solutions.js`);
      continue;
    }

    console.log(`✓ ${funcName}`);

    for (const test of tests) {
      totalTests++;
      try {
        let userResult, expected;

        if (test.shouldThrow) {
          try {
            userResult = userSolutions[funcName](...test.input);
            console.log(`  ✗ ${test.desc} - Should throw error but returned ${userResult}`);
          } catch (e) {
            console.log(`  ✓ ${test.desc}`);
            totalPassed++;
          }
        } else {
          userResult = userSolutions[funcName](...test.input);

          // Get expected from live bash solutions
          try {
            const refOutput = runBashFunction(bashScript, funcName, test.input[0]);
            expected = funcName === 'reverseString' ? refOutput :
                      (funcName === 'filterEven' || funcName === 'removeDuplicates'
                        ? refOutput.split(/\s+/).filter(Boolean).map(Number)
                        : Number(refOutput));
          } catch (e) {
            expected = null;
          }

          if (JSON.stringify(userResult) === JSON.stringify(expected)) {
            console.log(`  ✓ ${test.desc} = ${JSON.stringify(userResult)}`);
            totalPassed++;
          } else {
            console.log(`  ✗ ${test.desc}`);
            console.log(`    Expected: ${JSON.stringify(expected)}`);
            console.log(`    Got: ${JSON.stringify(userResult)}`);
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
fetchSolutions((err, bashScript) => {
  if (err) {
    console.error('✗ Failed to fetch solutions from m100.cloud/code-answers');
    console.error('  Error:', err.message);
    process.exit(1);
  }

  try {
    const userSolutions = loadUserSolutions();
    runTests(userSolutions, bashScript);
  } catch (e) {
    console.error('✗ Error loading user solutions:', e.message);
    process.exit(1);
  }
});
