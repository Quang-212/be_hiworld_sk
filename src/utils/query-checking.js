const queryChecking = (params, key) => {
  return !!params.query[key] && JSON.parse(params.query[key]?.toLowerCase());
};

module.exports = {
  queryChecking,
};
