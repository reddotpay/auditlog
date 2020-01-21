const general = require('./modules/general');
const { save } = require('./modules/save');
const { logArray, auditArray } = require('./modules/logger');

class RDPLog {
  // log(...info) {
  //   const obj = {
  //     type: 'info',
  //     timestamp: new Date().toUTCString(),
  //     info,
  //   };
  //   logArray.push(obj);
  // }

  error(errorObj, ...info) {
    const obj = {
      type: 'error',
      timestamp: new Date().toUTCString(),
      errorstack: errorObj,
      info,
    };
    logArray.push(obj);
  }

  async audit(event, response) {
    let auditBody;

    if (environment !== 'local') {
      const { headers, requestContext, httpMethod, path, body } = event;
      const productIndex = headers.Host.indexOf('.api');

      auditBody = {
        product: headers.Host.substr(0, productIndex),
        summary: `${path}[${httpMethod}]`,
        time: requestContext.requestTime,
        user: requestContext.authorizer && {
          companyId: requestContext.authorizer.companyid,
          groupId: requestContext.authorizer.groupid,
          userId: requestContext.authorizer.uuid,
          username: requestContext.authorizer.username,
        },
        traceId: headers['X-Amzn-Trace-Id'],
        stacktrace: general.getStackTrace(),
        payload: body ? body : null,
        response,
        stackObj: logArray,
      };

      return save([auditBody]);
    } else {
      if (displayAuditlog === 'true') {
        const { requestContext, httpMethod, body } = event;

        auditBody = {
          summary: `${requestContext.path}[${httpMethod}]`,
          stacktrace: general.getStackTrace(),
          payload: body ? body : null,
          response,
          stackObj: logArray,
        };
      }
    }
    console.log('auditBody>>', auditBody);
  }

  // *** DEPRECATED ***
  storeLog(...log) {
    if (log.length === 1) {
      logArray.push(general.convertToString(log[0]));
    } else {
      logArray.push(general.convertToString(log));
    }
  }
  async displayLog() {
    let response;

    // stream audit logs
    if (auditArray.length > 0) {
      response = await save(auditArray);
    };

    // console developer logs
    console.log(logArray.join('\n'));

    return response;
  }
  log(product, user, summary, ...message) {
    const audit = general.transform('audit', product, user, summary, ...message);
    auditArray.push(audit);
  }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
