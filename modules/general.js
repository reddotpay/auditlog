module.exports = {
  convertToString: (data) => {
    let cache = [];

    const res = JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return;
        }
        cache.push(value);
      }
      return value;
    }, 2);

    cache = null;

    return res;
  },
  getStackTrace: (deeper, deepest) => {
    const oldStack = Error.prepareStackTrace;
    const err = new Error();
    Error.prepareStackTrace = (e, stack) => stack;
    err.stack.shift();
    err.stack.shift();
    if (deeper) err.stack.shift();
    if (deepest) err.stack.shift();
    const lastTrace = err.stack.shift();
    const caller = lastTrace ? lastTrace.toString() : null;
    Error.prepareStackTrace = oldStack;
    return caller;
  },
  transform: (flag, product, user, summary, ...message) => {
    const transformedRecord = {};
    transformedRecord.createdAt = (new Date()).toUTCString();
    transformedRecord.flag = flag;
    transformedRecord.summary = summary;
    if (product && product !== null && product !== '') {
      transformedRecord.product = product;
    }
    if (user && user !== null && user !== '') {
      transformedRecord.user = user;
    } else {
      transformedRecord.user = 'root';
    }
    transformedRecord.message = [...message];
    return transformedRecord;
  },
  formatError: (error) => {
    if (error && typeof error === 'object') {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack && error.stack.split('\n'),
      };
    }
    return error;
  },
  clone: (obj) => {
    let newObj;

    try {
      newObj = obj ? JSON.parse(JSON.stringify(obj)) : obj;
    } catch (e) {
      // Do NOT clone circular object
      if (e.message.includes('circular')) newObj = obj;
    }

    return newObj;
  },
};
