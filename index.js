const general = require('./modules/general');
const { save } = require('./modules/save');
let { logArray, auditArray } = require('./modules/logger');
const { environment, displayAuditlog } = require('./config');

class RDPLog {
  log(summary, variable) {
    const obj = {
      type: 'info',
      createdAt: new Date().toUTCString(),
      sortDate: new Date().toJSON(),
      summary: typeof summary === 'string' ? summary : null,
      detail: variable,
      caller: [],
    };
    const firstTrace = general.getStackTrace();
    const secondTrace = general.getStackTrace(true);
    const thirdTrace = general.getStackTrace(true, true);

    if (firstTrace) obj.caller.push(firstTrace);
    if (secondTrace) obj.caller.push(secondTrace);
    if (thirdTrace) obj.caller.push(thirdTrace);

    logArray.push(obj);
  }

  error(summary, error) {
    const obj = {
      type: 'error',
      createdAt: new Date().toUTCString(),
      sortDate: new Date().toJSON(),
      summary: typeof summary === 'string' ? summary : null,
      errorstack: error ? general.formatError(error) : general.formatError(summary),
      caller: [],
    };
    const firstTrace = general.getStackTrace();
    const secondTrace = general.getStackTrace(true);
    const thirdTrace = general.getStackTrace(true, true);

    if (firstTrace) obj.caller.push(firstTrace);
    if (secondTrace) obj.caller.push(secondTrace);
    if (thirdTrace) obj.caller.push(thirdTrace);

    logArray.push(obj);
  }

  async audit(event, response) {
    const {
      httpMethod, path, requestContext, headers, body, queryStringParameters,
    } = event;

    let auditResponse;
    let data;

    if (environment !== 'local') {
      const productIndex = headers && headers.Host.indexOf('.api');

      auditResponse = {
        product: headers && headers.Host.substr(0, productIndex),
        summary: `${httpMethod} ${path}`,
        createdAt: new Date().toUTCString(),
        user: requestContext && requestContext.authorizer && {
          companyId: requestContext.authorizer.companyid,
          groupId: requestContext.authorizer.groupid,
          userId: requestContext.authorizer.uuid,
          username: requestContext.authorizer.username ? this.maskEmail(requestContext.authorizer.username) : null,
        },
        traceId: headers && headers['X-Amzn-Trace-Id'],
        stacktraceArray: logArray,
        request: {
          headers,
          queryStringParameters,
          body,
        },
        response,
      };

      // Log to Elasticsearch
      if ((environment === 'staging' || environment === 'production')
        && httpMethod !== 'OPTIONS') {
        data = await save([auditResponse]);
      }
    } else {
      auditResponse = {
        summary: `${httpMethod} ${path}`,
        createdAt: new Date().toUTCString(),
        stacktraceArray: logArray,
        request: {
          headers,
          body,
          queryStringParameters,
        },
        response,
      };

      data = 'LOCAL ENVIRONMENT';
    }

    // Log to Cloudwatch
    if (displayAuditlog === 'true') {
      if (httpMethod === 'OPTIONS') {
        console.log(auditResponse.summary);
      } else {
        console.log(general.convertToString(auditResponse));
      }
    }

    // Empty memory storage
    logArray = [];
    return data;
  }

  maskReturnDefault() {
    return '*'.repeat(16);
  }  

  maskEmail(email) {
    const username = email.split('@')[0];
    const firstThreeUsername = username.substr(0,3);
    const domain = email.split('@')[1];
  
    return firstThreeUsername + '*'.repeat(username.length - 3) + '@' + domain;
  }

  maskCard(cardNumber) {
    const digitsShown = 4;
    const cardLength = cardNumber.length;
    const last4Digit = cardNumber.substring(cardLength-digitsShown);
    return '*'.repeat(cardLength-digitsShown) + last4Digit;
  }

  maskString(string) {
    return '*'.repeat(string.length);
  }

  maskObject(object) {
    const objectKeys = Object.keys(object);
    objectKeys.forEach((key) => {
      object[key] = this.maskReturnDefault();
    })
    return object;
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
