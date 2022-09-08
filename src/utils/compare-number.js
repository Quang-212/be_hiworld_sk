module.exports = function compareNumber(a, b, type) {
  // check valid number
  if (isNaN(a) || isNaN(b)) {
    return false;
  }
  switch (type) {
    case "equal":
      return a === b;
    case "gt":
      return a > b;
    case "lt":
      return a < b;
    case "gte":
      return a >= b;
    case "lte":
      return a <= b;
    default:
      return false;
  }
};
