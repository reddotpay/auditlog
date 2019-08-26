const { transform } = require('./modules/transform');
const { save } = require('./modules/save');
const { logArray } = require('./modules/logger');

class RDPLog {
  async log(product, user, summary, ...message) {
    const record = transform("log", product, user, summary, ...message);
    await save(record);
  }

  async info(product, user, summary, ...message) {
    const record = transform("info", product, user, summary, ...message);
    await save(record);
  }

  async debug(product, user, summary, ...message) {
    const record = transform("debug", product, user, summary, ...message);
    await save(record);
  }

  async warn(product, user, summary, ...message) {
    const record = transform("warn", product, user, summary, ...message);
    await save(record);
  }

  async error(product, user, summary, ...message) {
    const record = transform("error", product, user, summary, ...message);
    await save(record);
  }
  storeLog(...log) {
    logArray.push(log);
  }
  displayLog() {
    console.log(logArray);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
