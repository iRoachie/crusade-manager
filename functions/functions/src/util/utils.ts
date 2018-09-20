import * as entries from 'object.entries';

const formatFirebaseArray = array =>
  entries(array).map(([key, value]) => ({
    key,
    ...value
  }));

export { formatFirebaseArray };
