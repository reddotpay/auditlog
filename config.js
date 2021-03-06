const pathExist = (path) => {
  try {
    const requiredModule = require(path);
    return !!requiredModule;
  } catch (e) {
    return false;
  }
};

if (pathExist('dotenv')) require('dotenv').config();

module.exports = {
  environment: process.env.ENVIRONMENT,
  deliveryStreamName: process.env.DELIVERY_STREAM_NAME,
  displayAuditlog: process.env.DISPLAY_AUDITLOG,
};
