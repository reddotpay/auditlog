const expect = require('chai').expect;
const sinon = require('sinon');

const rdpLog = require('../index');
const { stubFirehoseInstance } = require('../modules/save');
const { logArray } = require('../modules/logger');

let sinonSandbox = sinon.createSandbox();

describe('index.js ->', () => {
  describe('rdpLog.storeLog(log)', () => {
    // it('should return the data in an array', () => {
    //   rdpLog.storeLog('log1');
    //   rdpLog.storeLog('log2');
    //   rdpLog.storeLog('log3');
    //   expect(logArray).to.be.an('array').that.equal.apply(['log1', 'log2', 'log3']);
    // });
    it('should return both audit and console logs in an array', async () => {
      const testRecord = {
				createdAt: "timestamp",
				flag: "flag",
				product: "productId",
				user: "userId",
				message: ["list of messages"]
			}
      sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createSuccessStub');
      await rdpLog.log(testRecord);
      rdpLog.storeLog('log1');
      rdpLog.storeLog('log2', {testKey: "testValue"});
      rdpLog.storeLog('log3', 'log4');
      rdpLog.displayLog();
      expect(logArray).to.be.an('array');
      sinonSandbox.restore();
    })
  });
});;
