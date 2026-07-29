// Coding Skills Test - Implementations

function sumArray(arr) {
  return arr.reduce((total, n) => total + n, 0);
}

function filterEven(arr) {
  return arr.filter(n => n % 2 === 0);
}

function reverseString(str) {
  return [...str].reverse().join('');
}

function findMax(arr) {
  if (arr.length === 0) {
    throw new Error('findMax: array must not be empty');
  }
  return arr.reduce((max, n) => (n > max ? n : max));
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

module.exports = {
  sumArray,
  filterEven,
  reverseString,
  findMax,
  removeDuplicates,
};
