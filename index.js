const { transform } = require('./modules/transform');
const { save } = require('./modules/save');

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
}

const rdpLog = new RDPLog();

rdpLog.log("npmProduct", "user0002", `user0002 created something on npmProduct at ${new Date()}`, "full logs here!!");

module.exports = rdpLog;
