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
      createdAt: Joi.date().required(),
    });
    this.saveLog = (record) => {
      Joi.validate(record, this.recordSchema, (validationErr, value) => {
        if (validationErr) {
          console.log({
            status: 'validation error',
            message: 'validationErr.details',
          });
        } else {
          this.firehose.putRecord(
            {
              DeliveryStreamName: process.env.DELIVERY_STREAM_NAME_STAG,
              Record: {
                Data: Buffer.from(JSON.stringify(value)),
              },
            },
            (err, data) => {
              if (err) {
                console.log({
                  status: 'log failure',
                  message: err.stack,
                });
              } else {
                console.log({
                  status: 'log success',
                  recordId: data.RecordId,
                });
              }
            },
          );
        }
      });
    };
  }

  log(logMessageObj) {
    const record = logMessageObj;
    record.flag = 'log';
    record.createdAt = new Date();
    this.saveLog(record);
  }

  info(logMessageObj) {
    const record = logMessageObj;
    record.flag = 'info';
    record.createdAt = new Date();
    this.saveLog(record);
  }

  debug(logMessageObj) {
    const record = logMessageObj;
    record.flag = 'debug';
    record.createdAt = new Date();
    this.saveLog(record);
  }

  warn(logMessageObj) {
    const record = logMessageObj;
    record.flag = 'warn';
    record.createdAt = new Date();
    this.saveLog(record);
  }

  error(logMessageObj) {
    const record = logMessageObj;
    record.flag = 'error';
    record.createdAt = new Date();
    this.saveLog(record);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
