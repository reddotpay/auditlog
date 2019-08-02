/* eslint no-console: ["error", { allow: ["log"] }] */
const transform = (flag, product, user, ...message) => {
  const transformedRecord = {};
  transformedRecord.createdAt = (new Date()).toUTCString();
  transformedRecord.flag = flag;
  if(product && product !== null && product !== "") {
    transformedRecord.product = product;
  } else {
    console.log("product field cannot be empty or omitted");
  }
  if(user && user !== null && user !== "") {
    transformedRecord.user = user;
  } else {
    transformedRecord.user = "root";
  }
  transformedRecord.message = [...message];
  return transformedRecord;
}

module.exports = {
  transform,
}
