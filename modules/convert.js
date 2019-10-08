function convertToString(data) {
  let cache = [];

  const res = JSON.stringify(data, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return;
      }
      cache.push(value);
    }
    return value;
  });

  cache = null;

  return res;
}

module.exports = {
  convertToString,
}
