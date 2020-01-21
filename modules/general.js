module.exports = {
  convertToString: (data) => {
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
  },
  getStackTrace: () => {
    const oldStack = Error.prepareStackTrace;
    const err = new Error();
    Error.prepareStackTrace = (e, stack) => stack;
    console.log('stack trace>>', err.stack);
    console.log('typeof stack trace>>', typeof err.stack);
    err.stack.shift();
    const lastTrace = err.stack.shift();
    const caller = lastTrace.toString();
    Error.prepareStackTrace = oldStack;
    return caller;
  },
  transform: (flag, product, user, summary, ...message) => {
    const transformedRecord = {};
    transformedRecord.createdAt = (new Date()).toUTCString();
    transformedRecord.flag = flag;
    transformedRecord.summary = summary;
    if(product && product !== null && product !== "") {
      transformedRecord.product = product;
    } else {
      // logArray.push('Audit Log: Product field cannot be empty or omitted');
    }
    if(user && user !== null && user !== "") {
      transformedRecord.user = user;
    } else {
      transformedRecord.user = "root";
    }
    transformedRecord.message = [...message];
    return transformedRecord;
  },
}
