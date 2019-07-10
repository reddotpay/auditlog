/* eslint no-console: ["error", { allow: ["log"] }] */
require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

class RDPLog {
  constructor() {
    this.firehose = new AWS.Firehose();
    this.transformRecord = (flag, record) => {
      const transformedRecord = {};
      transformedRecord.createdAt = (new Date()).toUTCString();
      transformedRecord.flag = flag;
      if(record.product) {
        transformedRecord.product = record.product;
      } else {
        throw "product field cannot be empty or omitted";
      }
      transformedRecord.user =  record.user ? record.user : "root";
      transformedRecord.message = record.message;
      return transformedRecord;
    };
    this.saveLog = async (record) => {
      try {
        const promise = await this.firehose.putRecord(
          {
            DeliveryStreamName: process.env.DELIVERY_STREAM_NAME_STAG,
            Record: {
              Data: Buffer.from(JSON.stringify(record, null, 2)),
            },
          },
        ).promise();
        if(process.env.ENVIRONMENT === 'dev' && promise){
          console.log(JSON.stringify(record, null, 2));
        }
      } catch(err) {
        console.log('error', err);
      }
    };
  }

  async log(logMessageObj) {
    const record = this.transformRecord("log", logMessageObj);
    await this.saveLog(record);
  }

  async info(logMessageObj) {
    const record = this.transformRecord("info", logMessageObj);
    await this.saveLog(record);
  }

  async debug(logMessageObj) {
    const record = this.transformRecord("debug", logMessageObj);
    await this.saveLog(record);
  }

  async warn(logMessageObj) {
    const record = this.transformRecord("warn", logMessageObj);
    await this.saveLog(record);
  }

  async error(logMessageObj) {
    const record = this.transformRecord("error", logMessageObj);
    await this.saveLog(record);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
