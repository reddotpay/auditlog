const { transform } = require('./modules/transform');
const { save } = require('./modules/save');
const { logArray, auditArray } = require('./modules/logger');

class RDPLog {
  log(product, user, summary, ...message) {
    const audit = transform("audit", product, user, summary, ...message);
    auditArray.push(audit);
  }
  storeLog(...log) {
    logArray.push(log);
  }
  displayLog() {
    logArray.forEach(log => {
      console.log(log);
    });
    if (auditArray.length > 0) {
      return save(auditArray);
    }
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
