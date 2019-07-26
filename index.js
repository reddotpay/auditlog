/* eslint no-console: ["error", { allow: ["log"] }] */
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

class RDPLog {
  constructor() {
    this.firehose = new AWS.Firehose();
    this.transformRecord = (flag, product, user, ...message) => {
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
    };
    this.saveLog = async (record) => {
      try {
        const env = process.env.ENVIRONMENT;
        const displayLog = env === 'dev' || env === 'development' || env === 'stag' || env === 'staging';
        const promise = await this.firehose.putRecord(
          {
            DeliveryStreamName: process.env.DELIVERY_STREAM_NAME,
            Record: {
              Data: Buffer.from(JSON.stringify(record, null, 2)),
            },
          },
        ).promise();
        if(promise && displayLog){
          console.log(JSON.stringify(record, null, 2));
        }
      } catch(err) {
        console.log('error', err);
      }
    };
  }

  async log(product, user, ...message) {
    const record = this.transformRecord("log", product, user, ...message);
    await this.saveLog(record);
  }

  async info(product, user, ...message) {
    const record = this.transformRecord("info", product, user, ...message);
    await this.saveLog(record);
  }

  async debug(product, user, ...message) {
    const record = this.transformRecord("debug", product, user, ...message);
    await this.saveLog(record);
  }

  async warn(product, user, ...message) {
    const record = this.transformRecord("warn", product, user, ...message);
    await this.saveLog(record);
  }

  async error(product, user, ...message) {
    const record = this.transformRecord("error", product, user, ...message);
    await this.saveLog(record);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
