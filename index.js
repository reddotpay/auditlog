const { transform } = require('./modules/transform');
const { save } = require('./modules/save');

class RDPLog {
  async log(product, user, ...message) {
    const record = transform("log", product, user, ...message);
    await save(record);
  }

  async info(product, user, ...message) {
    const record = transform("info", product, user, ...message);
    await save(record);
  }

  async debug(product, user, ...message) {
    const record = transform("debug", product, user, ...message);
    await save(record);
  }

  async warn(product, user, ...message) {
    const record = transform("warn", product, user, ...message);
    await save(record);
  }

  async error(product, user, ...message) {
    const record = transform("error", product, user, ...message);
    await save(record);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
