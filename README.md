# Coding Skills Test

Test your array utility implementations by submitting your code for validation.

## The Challenge

Implement 5 array utility functions:

1. `sumArray(arr)` — Calculate sum of all numbers
2. `filterEven(arr)` — Return only even numbers
3. `reverseString(str)` — Reverse a string
4. `findMax(arr)` — Find the largest number
5. `removeDuplicates(arr)` — Remove duplicate values

## Quick Start

```bash
npm install
npm test
```

When you run `npm test`:
- Your code is tested against live reference implementations from m100.cloud
- Results show which functions pass or fail
- A verification token displays if all tests pass

## Your Implementation

Create `src/solutions.js` with your implementations:

```javascript
module.exports = {
  sumArray: function(arr) {
    // Your code here
  },

  filterEven: function(arr) {
    // Your code here
  },

  reverseString: function(str) {
    // Your code here
  },

  findMax: function(arr) {
    // Your code here
  },

  removeDuplicates: function(arr) {
    // Your code here
  }
};
```

## Testing With Haiku 4.5

Ask Haiku to validate your code:

> "Please clone https://github.com/Millstone123/coding-skills-test and run `npm test` to validate the implementations in src/solutions.js."

Haiku will run the tests and report whether your code is correct.

## Test Coverage

27 total test cases covering:
- Basic functionality
- Edge cases (empty arrays, single elements)
- Error conditions
- All functions

## Success

All tests pass when:
- ✅ All 5 functions implemented correctly
- ✅ All 27 test cases pass
- ✅ Verification token displays
