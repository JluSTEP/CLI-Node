function shiftedDiff(first, second) {
    if (first.length !== second.length) return -1;
  
    const doubleFirst = first + first;
    const index = doubleFirst.indexOf(second);
  
    return index === -1 ? -1 : index;
  }
  
  module.exports = shiftedDiff;
  