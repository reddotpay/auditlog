const expect = require('chai').expect;
const sinon = require('sinon');

const rdpLog = require('../index');
const { stubFirehoseInstance } = require('../modules/save');
const { logArray } = require('../modules/logger');

const nestedObjSample = {
  "a":"a",
  "b":{
     "c":"c",
     "d":{
        "e":"e",
        "f":{
           "g":"g",
           "h":{
              "i":"i"
           }
        }
     }
  }
};

let sinonSandbox = sinon.createSandbox();

describe('index.js ->', () => {
  describe('rdpLog.storeLog(log)', () => {
    it('should return both audit and console logs in an array', async () => {
      sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createSuccessStub');
      rdpLog.log('product', 'user', 'summary', 'message');
      rdpLog.storeLog(nestedObjSample); // a nested object params
      rdpLog.storeLog(['log2', 'log3']); // an array param
      rdpLog.storeLog('log4', {testKey: "log5"}); // more than one params
      rdpLog.displayLog();
      expect(logArray).to.be.an('array');
      sinonSandbox.restore();
    });
  });
});;
