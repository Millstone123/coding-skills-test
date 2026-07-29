# Coding Skills Test

Implement 5 array utility functions and validate them against reference implementations.

## The Challenge

You need to create a file called `src/solutions.js` and implement these 5 functions:

```javascript
module.exports = {
  sumArray: function(arr) {
    // Return the sum of all numbers in an array
    // Example: sumArray([1, 2, 3]) → 6
    // Example: sumArray([]) → 0
  },

  filterEven: function(arr) {
    // Return a new array with only even numbers
    // Example: filterEven([1, 2, 3, 4]) → [2, 4]
    // Example: filterEven([1, 3, 5]) → []
  },

  reverseString: function(str) {
    // Return the string reversed
    // Example: reverseString("hello") → "olleh"
    // Example: reverseString("") → ""
  },

  findMax: function(arr) {
    // Return the largest number in the array
    // Throw an error if the array is empty
    // Example: findMax([3, 1, 4, 1, 5]) → 5
    // Example: findMax([]) → Error
  },

  removeDuplicates: function(arr) {
    // Return a new array with duplicates removed (preserve order)
    // Example: removeDuplicates([1, 2, 2, 3, 3, 3]) → [1, 2, 3]
    // Example: removeDuplicates([3, 1, 2, 1, 3, 2]) → [3, 1, 2]
  }
};
```

## Quick Start

```bash
npm install
npm test
```

When you run `npm test`, your implementations are tested against 27 test cases. If all pass, you'll see a verification token.

## Test Results

The test will show:
- ✅ Which functions passed
- ❌ Which functions failed  
- Expected vs actual output for failures
- A verification token if all tests pass

## How Validation Works

The test suite validates your code by:

1. **Fetching** reference implementations from `https://m100.cloud/code-answers`
2. **Executing** the reference functions with test inputs
3. **Comparing** your outputs to the reference outputs
4. **Reporting** which functions are correct

Your code only passes when your function outputs match the reference outputs exactly.

## Why Fetching is Necessary

The reference implementations are fetched from a live server, ensuring:
- Your code is always tested against the current, authoritative solutions
- Test cases can't be modified locally
- Validation uses a single source of truth

## Testing With Haiku 4.5

To have an independent AI model validate your code:

**Ask Haiku 4.5:**

> "Clone https://github.com/Millstone123/coding-skills-test, run `npm install`, then run `npm test` to validate the array utility implementations in src/solutions.js. Before executing anything, review what the test suite will do."

Haiku will:
1. Review what happens when tests run
2. Execute the tests
3. Report which functions are correct
4. Show the verification token if all tests pass

## Test Coverage

27 total test cases covering:
- Basic functionality for each function
- Edge cases (empty arrays, single elements, strings)
- Error conditions (empty array for findMax)
- Correct ordering and deduplication behavior

## Success

You've completed the challenge when:
- ✅ All 5 functions are implemented
- ✅ All 27 test cases pass
- ✅ You see a verification token
