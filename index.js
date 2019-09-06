const { transform } = require('./modules/transform');
const { save } = require('./modules/save');
let { logArray, auditArray } = require('./modules/logger');

class RDPLog {
  log(product, user, summary, ...message) {
    const audit = transform('audit', product, user, summary, ...message);
    auditArray.push(audit);
  }
  storeLog(...log) {
    logArray.push(log);
  }
  displayLog() {
    // console developer logs

    // logArray = logArray.map(log => {
    //   if (log.length === 1) {
    //     return `${JSON.stringify(log[0])}`;
    //   }
    //   return `${JSON.stringify(log)}`;
    // });
    console.log(JSON.stringify(logArray));

    // stream audit logs
    if (auditArray.length > 0) {
      return save(auditArray);
    }
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
