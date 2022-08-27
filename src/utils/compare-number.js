module.exports = function compareNumber(a, b, option) {
  // check valid number
  if (isNaN(a) || isNaN(b)) {
    return false;
  }
  if (option) {
    switch (option) {
      case "equal":
        return a === b;
      case "greater":
        return a > b;
      case "less":
        return a < b;
      case "greaterEqual":
        return a >= b;
      case "lessEqual":
        return a <= b;
      default:
        return false;
    }
  }
  if (a === b) {
    return 0;
  }

  return a > b ? 1 : -1;
};
