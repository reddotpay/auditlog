/* eslint no-console: ["error", { allow: ["log"] }] */
const AWS = require('aws-sdk');
const { deliveryStreamName } = require('../config');

AWS.config.update({ region: 'ap-southeast-1' });
let firehose = new AWS.Firehose();

const save = async (auditList) => {
  let promise;

  const records = auditList.map(audit => {
    return {
      Data: Buffer.from(JSON.stringify(audit, null, 2))
    };
  });

  const params = {
    DeliveryStreamName: deliveryStreamName,
    Records: records,
  }

  try {
    promise = await firehose.putRecordBatch(params).promise();
  } catch(e) {
    return e;
  }

  return promise;
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
