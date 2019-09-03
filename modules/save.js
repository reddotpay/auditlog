/* eslint no-console: ["error", { allow: ["log"] }] */
const AWS = require('aws-sdk');
const { environment, deliveryStreamName } = require('../config');

AWS.config.update({ region: 'ap-southeast-1' });
let firehose = new AWS.Firehose();

const save = (auditList) => {
  const env = environment;
  const displayLog = env === 'dev' || env === 'development' || env === 'stag' || env === 'staging';

  const records = auditList.map(d => {
    return {
      Data: Buffer.from(JSON.stringify(d, null, 2))
    };
  });

  const params = {
    DeliveryStreamName: deliveryStreamName,
    Records: records,
  }

  firehose.putRecordBatch(params, (err, data) => {
    if (err) {
      return err;
    }
    if (displayLog) {
      let response = {
        code: 200,
        message: `Successfully streamed ${auditList.length} audit to firehose`,
      }
      console.log(response);
    }
    return data;
  });
};

// ### For Unit Testing ###
const stubFirehoseInstance = (sinonSandbox, stubStatus) => {
  if(stubStatus === "createErrorStub") {
    sinonSandbox.stub(firehose, 'putRecordBatch').throws(new TypeError());
  } else if(stubStatus === "createSuccessStub") {
    sinonSandbox.stub(firehose, 'putRecordBatch')
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
