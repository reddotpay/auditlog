const expect = require('chai').expect;
const sinon = require('sinon');

const rdpLog = require('../index');
const { stubFirehoseInstance } = require('../modules/save');
const { logArray } = require('../modules/logger');

let sinonSandbox = sinon.createSandbox();

describe('index.js ->', () => {
  describe('rdpLog.storeLog(log)', () => {
    it('should return both audit and console logs in an array', async () => {
      sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createSuccessStub');
      rdpLog.log('product', 'user', 'summary', 'message');
      rdpLog.storeLog('log1');
      rdpLog.storeLog('log2', {testKey: "testValue"});
      rdpLog.storeLog('log3', 'log4');
      rdpLog.displayLog();
      expect(logArray).to.be.an('array');
      sinonSandbox.restore();
    })
  });
});;
