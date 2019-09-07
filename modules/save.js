/* eslint no-console: ["error", { allow: ["log"] }] */
const AWS = require('aws-sdk');
const { environment, deliveryStreamName } = require('../config');

AWS.config.update({ region: 'ap-southeast-1' });
let firehose = new AWS.Firehose();

const save = async (auditList) => {
  const env = environment;
  const displayLog = env === 'dev' || env === 'development' || env === 'stag' || env === 'staging';

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
    return await firehose.putRecordBatch(params).promise();
  } catch(e) {
    return e;
  }

  // return firehose.putRecordBatch(params, (err, data) => {
  //   const promise = new Promise((resolve, reject) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     if (displayLog) {
  //       let response = {
  //         code: 200,
  //         message: `Successfully streamed ${auditList.length} audit to firehose`,
  //       }
  //       console.log(response);
  //     }
  //     resolve(data);
  //   });
    
  //   promise.then(res => {
  //     return res;
  //   }).catch(err => {
  //     return err;
  //   });
  // });
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
