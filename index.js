const { transform } = require('./modules/transform');
const { save } = require('./modules/save');
let { logArray, auditArray } = require('./modules/logger');

class RDPLog {
  log(product, user, summary, ...message) {
    const audit = transform('audit', product, user, summary, ...message);
    auditArray.push(audit);
  }
  storeLog(...log) {
    if (log.length === 1) {
      logArray.push(JSON.stringify(log[0]));
    } else {
      logArray.push(JSON.stringify(log));
    }
  }
  displayLog() {
    // console developer logs
    if (logArray.length > 0) {
      console.log(logArray);
    }

    // stream audit logs
    if (auditArray.length > 0) {
      return save(auditArray);
    };
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
