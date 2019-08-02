/* eslint no-console: ["error", { allow: ["log"] }] */
const AWS = require('aws-sdk');
const { environment, deliveryStreamName } = require('../config');

AWS.config.update({ region: 'ap-southeast-1' });
let firehose = new AWS.Firehose();

const save = async (record) => {
  try {
    const env = environment;
    const displayLog = env === 'dev' || env === 'development' || env === 'stag' || env === 'staging';
    const promise = await firehose.putRecord(
      {
        DeliveryStreamName: deliveryStreamName,
        Record: {
          Data: Buffer.from(JSON.stringify(record, null, 2)),
        },
      },
    ).promise();
    if(promise && displayLog){
      console.log(JSON.stringify(record, null, 2));
    }
    return promise;
  } catch(err) {
    console.log('error', err);
  }
};

// ### For Unit Testing ###
const stubFirehoseInstance = (sinonSandbox, stubStatus) => {
  if(stubStatus === "createErrorStub") {
    sinonSandbox.stub(firehose, 'putRecord').throws(new TypeError());
  } else if(stubStatus === "createSuccessStub") {
    sinonSandbox.stub(firehose, 'putRecord')
    .returns({
      promise: () => {
        return {
          ETag: '"sampleETag-ae771fbbba6a74eeeb77754355831713"',
        }
      }
    });
  }
  return sinonSandbox;
}

module.exports = {
  save,
  stubFirehoseInstance,
}
