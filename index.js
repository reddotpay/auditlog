const general = require('./modules/general');
const { save } = require('./modules/save');
const { logArray, auditArray } = require('./modules/logger');
const { environment, displayAuditlog } = require('./config');

class RDPLog {
  log(summary, variable) {
    const obj = {
      type: 'info',
      createdAt: new Date().toUTCString(),
      caller: [general.getStackTrace(),general.getStackTrace(true),general.getStackTrace(true, true)],
      summary: typeof summary === 'string' ? summary : null,
      detail: typeof variable === 'object' ? variable : summary,
    };
    logArray.push(obj);
  }

  error(summary, error) {
    const obj = {
      type: 'error',
      createdAt: new Date().toUTCString(),
      caller: [general.getStackTrace(),general.getStackTrace(true),general.getStackTrace(true, true)],
      summary: typeof summary === 'string' ? summary : null,
      errorstack: typeof error === 'object' ? error : summary,
    };
    logArray.push(obj);
  }

  async audit(event, response) {
    let auditResponse;
    let data;

    if (environment !== 'local') {
      const {
        headers, requestContext, httpMethod, path, body, queryStringParameters,
      } = event;
      const productIndex = headers.Host.indexOf('.api');

      auditResponse = {
        product: headers.Host.substr(0, productIndex),
        summary: `${httpMethod} ${path}`,
        createdAt: new Date().toUTCString(),
        user: requestContext.authorizer && {
          companyId: requestContext.authorizer.companyid,
          groupId: requestContext.authorizer.groupid,
          userId: requestContext.authorizer.uuid,
          username: this.maskEmail(requestContext.authorizer.username),
        },
        traceId: headers['X-Amzn-Trace-Id'],
        stacktraceArray: logArray,
        request: {
          headers,
          queryStringParameters,
          body,
        },
        response,
      };

      if (environment === 'staging' || environment === 'production ') {
        data = await save([auditResponse]);
      }
    } else {
      const {
        path, httpMethod, headers, body, queryStringParameters,
      } = event;

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

    if (displayAuditlog === 'true') {
      console.log(general.convertToString(auditResponse));      
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
