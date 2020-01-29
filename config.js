const { pathExist } = require('./modules/general');

let envJSON = {
  ENVIRONMENT: '',
  DELIVERY_STREAM_NAME: '',
  DISPLAY_AUDITLOG: '',
};

if (pathExist('dotenv')) require('dotenv').config();
if (pathExist('../../../env.json')) envJSON = require('../../../env.json');

module.exports = {
  environment: process.env.ENVIRONMENT || envJSON.ENVIRONMENT,
  deliveryStreamName: process.env.DELIVERY_STREAM_NAME || envJSON.DELIVERY_STREAM_NAME,
  displayAuditlog: process.env.DISPLAY_AUDITLOG || envJSON.DISPLAY_AUDITLOG,
};
