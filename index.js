const general = require('./modules/general');
const { save } = require('./modules/save');
const { logArray, auditArray } = require('./modules/logger');
const { environment, displayAuditlog } = require('./config');

class RDPLog {
  log(...info) {
    const obj = {
      type: 'info',
      createdAt: new Date().toUTCString(),
      info: general.convertToString(...info),
    };
    logArray.push(obj);
  }

  error(errorObj, ...info) {
    const obj = {
      type: 'error',
      createdAt: new Date().toUTCString(),
      errorstack: general.convertToString(errorObj),
      info: general.convertToString(...info),
    };
    logArray.push(obj);
  }

  async audit(event, response) {
    let auditResponse;
    let data;

    if (environment !== 'local') {
      const { headers, requestContext, httpMethod, path, body } = event;
      const productIndex = headers.Host.indexOf('.api');

      auditResponse = {
        product: headers.Host.substr(0, productIndex),
        summary: `${path}[${httpMethod}]`,
        createdAt: new Date().toUTCString(),
        user: requestContext.authorizer && {
          companyId: requestContext.authorizer.companyid,
          groupId: requestContext.authorizer.groupid,
          userId: requestContext.authorizer.uuid,
          username: requestContext.authorizer.username,
        },
        traceId: headers['X-Amzn-Trace-Id'],
        lastStacktrace: general.getStackTrace(),
        stacktraceArray: logArray,
        payload: body ? body : null,
        response,
      };

      data = await save([auditResponse]);
    } else {
      const { requestContext, httpMethod, body } = event;

      auditResponse = {
        summary: `${requestContext.path}[${httpMethod}]`,
        createdAt: new Date().toUTCString(),
        lastStacktrace: general.getStackTrace(),
        stacktraceArray: logArray,
        payload: body ? body : null,
        response,
      };

      data = 'LOCAL ENVIRONMENT';
    }

    if (displayAuditlog === 'true') {
      console.log('auditResponse>>', auditResponse);      
    }

    return data;
  }

  maskEmail(email) {
    const username = email.split('@')[0];
    const firstThreeUsername = username.substr(0,3);
    const domain = email.split('@')[1];
  
    return firstThreeUsername + star.repeat(username.length - 3) + '@' + domain;
  }

  maskCard(cardNumber) {
    const digitsShown = 4;
    const cardLength = cardNumber.length;
    const last4Digit = cardNumber.substring(cardLength-digitsShown);
    return star.repeat(cardLength-digitsShown) + last4Digit;
  }

  maskString(string) {
    return star.repeat(string.length);
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
  // log(product, user, summary, ...message) {
  //   const audit = general.transform('audit', product, user, summary, ...message);
  //   auditArray.push(audit);
  // }
}

const rdpLog = new RDPLog();

module.exports = rdpLog;
