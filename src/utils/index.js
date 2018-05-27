import entries from 'object.entries';

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const formatFirebaseArray = array =>
  entries(array).map(([key, value]) => ({
    key,
    ...value
  }));

export { groupBy, formatFirebaseArray };
