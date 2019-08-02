require('dotenv').config();

module.exports = {
  environment: process.env.ENVIRONMENT,
  deliveryStreamName: process.env.DELIVERY_STREAM_NAME,
};
