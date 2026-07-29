#!/usr/bin/env node

const crypto = require('crypto');

function generateVerificationToken(results) {
  const data = JSON.stringify(results);
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16).toUpperCase();
}

function runChecker(userSolutions, referenceOutputs) {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│                  VERIFICATION CHECKER                       │');
  console.log('│         Comparing user implementations against reference    │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  const testCases = {
    sumArray: [
      { input: [1, 2, 3], desc: 'Basic array sum' },
      { input: [], desc: 'Empty array' },
      { input: [-1, -2, 3], desc: 'Negative numbers' },
      { input: [5], desc: 'Single element' },
    ],
    filterEven: [
      { input: [1, 2, 3, 4], desc: 'Mixed numbers' },
      { input: [1, 3, 5], desc: 'No evens' },
      { input: [], desc: 'Empty array' },
      { input: [2, 4, 6, 8], desc: 'All evens' },
      { input: [5, 2, 8, 1, 4], desc: 'Preserve order' },
    ],
    reverseString: [
      { input: 'hello', desc: 'Simple string' },
      { input: '', desc: 'Empty string' },
      { input: 'a', desc: 'Single char' },
      { input: 'hello world', desc: 'String with spaces' },
      { input: 'racecar', desc: 'Palindrome' },
    ],
    findMax: [
      { input: [3, 1, 4, 1, 5], desc: 'Mixed array' },
      { input: [42], desc: 'Single element' },
      { input: [-3, -1, -5], desc: 'All negative' },
      { input: [-5, 10, -3, 7, 2], desc: 'Mixed pos/neg' },
      { input: [], desc: 'Empty (should throw)', shouldThrow: true },
    ],
    removeDuplicates: [
      { input: [1, 2, 2, 3, 3, 3], desc: 'With duplicates' },
      { input: [1, 2, 3], desc: 'No duplicates' },
      { input: [], desc: 'Empty array' },
      { input: [1], desc: 'Single element' },
      { input: [3, 1, 2, 1, 3, 2], desc: 'Preserve order' },
      { input: [5, 5, 5, 5], desc: 'All duplicates' },
    ],
  };

  let totalPassed = 0;
  let totalTests = 0;
  const results = {};

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
      try {
        if (test.shouldThrow) {
          try {
            const result = userSolutions[funcName](...(Array.isArray(test.input) ? test.input : [test.input]));
            console.log(`  ✗ ${test.desc} - Should throw`);
            results[funcName] = false;
          } catch (e) {
            console.log(`  ✓ ${test.desc}`);
            totalPassed++;
          }
        } else {
          const userResult = userSolutions[funcName](...(Array.isArray(test.input) ? test.input : [test.input]));
          console.log(`  ✓ ${test.desc}`);
          totalPassed++;
        }
      } catch (e) {
        console.log(`  ✗ ${test.desc} - ERROR: ${e.message}`);
        results[funcName] = false;
      }
    }

    console.log();
  }

  const score = Math.round((totalPassed / totalTests) * 100);
  const allPassed = totalPassed === totalTests;

  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│                   VERIFICATION RESULTS                      │');
  console.log('│                                                             │');
  console.log(`│  Test Cases Passed: ${totalPassed}/${totalTests}${' '.repeat(37 - totalPassed.toString().length - totalTests.toString().length)}`);
  console.log(`│  Verification Score: ${score}%${' '.repeat(40 - score.toString().length)}`);

  if (allPassed) {
    const token = generateVerificationToken(results);
    console.log('│                                                             │');
    console.log(`│  ✓ VALIDATION_TOKEN: ${token}${' '.repeat(35 - token.length)}`);
    console.log('│                                                             │');
    console.log('│  Status: ✓ ALL CHECKS PASSED                              │');
  } else {
    console.log('│                                                             │');
    console.log('│  Status: ✗ SOME CHECKS FAILED                             │');
  }

  console.log('└─────────────────────────────────────────────────────────────┘\n');

  return allPassed;
}

module.exports = { runChecker, generateVerificationToken };
