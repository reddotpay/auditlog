/* eslint no-console: ["error", { allow: ["log"] }] */
require('dotenv').config();
const AWS = require('aws-sdk');
const Joi = require('@hapi/joi');

AWS.config.update({ region: 'ap-southeast-1' });

class RDPLog {
  constructor() {
    this.firehose = new AWS.Firehose();
    this.recordSchema = Joi.object().keys({
      flag: Joi.string().valid(['log', 'debug', 'info', 'warn', 'error']).required(),
      message: Joi.string().required(),
      createdAt: Joi.date(),
    });
  }

  doPutRecord(record) {
    Joi.validate(record, this.recordSchema, (validationErr, value) => {
      if (validationErr) {
        console.log(validationErr.details);
      } else {
        this.firehose.putRecord(
          {
            DeliveryStreamName: process.env.DELIVERY_STREAM_NAME,
            Record: {
              Data: Buffer.from(JSON.stringify(value)),
            },
          },
          (err, data) => {
            if (err) {
              console.log('err', err.stack);
            } else {
              console.log('data', data);
            }
          },
        );
      }
    });
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
