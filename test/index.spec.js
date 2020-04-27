const expect = require('chai').expect;
const sinon = require('sinon');

const rdpLog = require('../index');
const { stubFirehoseInstance } = require('../modules/save');
const { logArray } = require('../modules/logger');

const nestedObjSample = {
  "a":"a",
  "b":{
     "c":"c",
     "d":{
        "e":"e",
        "f":{
           "g":"g",
           "h":{
              "i":"i"
           }
        }
     }
  }
};

const instantPayResSample = {
  status: 201,
  statusText: 'Created',
  headers: 
   { 'content-type': 'application/json; charset=utf-8',
     'content-length': '669',
     connection: 'close',
     date: 'Tue, 31 Dec 2069 00:00:00 GMT',
     'x-amzn-requestid': 'befe8b4b-****-****-****-afd5a847b26a',
     'x-amzn-remapped-content-length': '669',
     'x-amzn-remapped-connection': 'close',
     'x-amz-apigw-id': 'xxxxxxxxxxxxxxxx',
     vary: 'Origin',
     etag: 'W/"xxxx/vRPA"',
     'x-powered-by': 'Express',
     'x-amzn-trace-id': 'Root=1-5d9c5114-3f9a1c94041dd0c95449eacb',
     'x-amzn-remapped-date': 'Tue, 31 Dec 2069 00:00:00 GMT',
     'x-cache': 'Miss from cloudfront',
     via: '1.1 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.cloudfront.net (CloudFront)',
     'x-amz-cf-pop': 'xxxxx-xx',
     'x-amz-cf-id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  config: 
   { url: 'https://xxx.sg/v1/payments/token/xxx',
     method: 'post',
     data: '{"orderId":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","amount":"100.00","currency":"SGD"}',
     headers: 
      { Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'User-Agent': 'axios/0.19.0',
        'Content-Length': 76 },
     transformRequest: [ [Function] ],
     transformResponse: [ [Function] ],
     timeout: 0,
     adapter: [Function],
     xsrfCookieName: 'XSRF-TOKEN',
     xsrfHeaderName: 'X-XSRF-TOKEN',
     maxContentLength: -1,
     validateStatus: [Function] },
  request: {
   ClientRequest: {
     domain: null,
     _events: 
      { socket: [Function],
        abort: [Function],
        aborted: [Function],
        error: [Function],
        timeout: [Function],
        prefinish: [Function] },
     _eventsCount: 6,
     _maxListeners: undefined,
     output: [],
     outputEncodings: [],
     outputCallbacks: [],
     outputSize: 0,
     writable: true,
     _last: true,
     upgrading: false,
     chunkedEncoding: false,
     shouldKeepAlive: false,
     useChunkedEncodingByDefault: true,
     sendDate: false,
     _removedConnection: false,
     _removedContLen: false,
     _removedTE: false,
     _contentLength: null,
     _hasBody: true,
     _trailer: '',
     finished: true,
     _headerSent: true,
     socket: {
      TLSSocket: {
        _tlsOptions: [Object],
        _secureEstablished: true,
        _securePending: false,
        _newSessionPending: false,
        _controlReleased: true,
        _SNICallback: null,
        servername: null,
        npnProtocol: false,
        alpnProtocol: false,
        authorized: true,
        authorizationError: null,
        encrypted: true,
        _events: [Object],
        _eventsCount: 9,
        connecting: false,
        _hadError: false,
        _handle: null,
        _parent: null,
        _host: 'xxx.sg',
        _readableState: [Object],
        readable: false,
        domain: null,
        _maxListeners: undefined,
        _writableState: [Object],
        writable: false,
        allowHalfOpen: false,
        _bytesDispatched: 1237,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: undefined,
        _server: null,
        ssl: null,
        _requestCert: true,
        _rejectUnauthorized: true,
        parser: null,
        _httpMessage: ['Circular'],
        read: [Function],
        _consuming: true,
        _idleNext: null,
        _idlePrev: null,
        _idleTimeout: -1,
        [Symbol('asyncId')]: 210,
        [Symbol('bytesRead')]: 1368 },
      },
     connection: {
      TLSSocket: {
        _tlsOptions: [Object],
        _secureEstablished: true,
        _securePending: false,
        _newSessionPending: false,
        _controlReleased: true,
        _SNICallback: null,
        servername: null,
        npnProtocol: false,
        alpnProtocol: false,
        authorized: true,
        authorizationError: null,
        encrypted: true,
        _events: [Object],
        _eventsCount: 9,
        connecting: false,
        _hadError: false,
        _handle: null,
        _parent: null,
        _host: 'xxx.sg',
        _readableState: [Object],
        readable: false,
        domain: null,
        _maxListeners: undefined,
        _writableState: [Object],
        writable: false,
        allowHalfOpen: false,
        _bytesDispatched: 1237,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: undefined,
        _server: null,
        ssl: null,
        _requestCert: true,
        _rejectUnauthorized: true,
        parser: null,
        _httpMessage: ['Circular'],
        read: [Function],
        _consuming: true,
        _idleNext: null,
        _idlePrev: null,
        _idleTimeout: -1,
        [Symbol('asyncId')]: 210,
        [Symbol('bytesRead')]: 1368 },
      },
     _header: 'POST /v1/payments/token/xxxxxxxxxxxxxxxx HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/json\r\nAuthorization: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\r\nUser-Agent: axios/0.19.0\r\nContent-Length: 76\r\nHost: xxx.sg\r\nConnection: close\r\n\r\n',
     _onPendingData: [Function],
     agent: {
      Agent: {
        domain: null,
        _events: [Object],
        _eventsCount: 1,
        _maxListeners: undefined,
        defaultPort: 443,
        protocol: 'https:',
        options: [Object],
        requests: {},
        sockets: [Object],
        freeSockets: {},
        keepAliveMsecs: 1000,
        keepAlive: false,
        maxSockets: Infinity,
        maxFreeSockets: 256,
        maxCachedSessions: 100,
        _sessionCache: [Object] },
     },
     socketPath: undefined,
     timeout: undefined,
     method: 'POST',
     path: '/v1/payments/token/xxxxxxxxxxxxxxxx',
     _ended: true,
     res: {
      IncomingMessage: {
        _readableState: [Object],
        readable: false,
        domain: null,
        _events: [Object],
        _eventsCount: 3,
        _maxListeners: undefined,
        socket: [Object],
        connection: [Object],
        httpVersionMajor: 1,
        httpVersionMinor: 1,
        httpVersion: '1.1',
        complete: true,
        headers: [Object],
        rawHeaders: [Array],
        trailers: {},
        rawTrailers: [],
        upgrade: false,
        url: '',
        method: null,
        statusCode: 201,
        statusMessage: 'Created',
        client: [Object],
        _consuming: true,
        _dumped: false,
        req: ['Circular'],
        responseUrl: 'https://xxx.sg/v1/payments/token/xxxxxxxxxxxxxxxx',
        redirects: [],
        read: [Function] },
      },
     aborted: undefined,
     timeoutCb: null,
     upgradeOrConnect: false,
     parser: null,
     maxHeadersCount: null,
     _redirectable: {
      Writable: {
        _writableState: [Object],
        writable: true,
        domain: null,
        _events: [Object],
        _eventsCount: 2,
        _maxListeners: undefined,
        _options: [Object],
        _redirectCount: 0,
        _redirects: [],
        _requestBodyLength: 76,
        _requestBodyBuffers: [],
        _onNativeResponse: [Function],
        _currentRequest: ['Circular'],
        _currentUrl: 'https://xxx.sg/v1/payments/token/xxxxxxxxxxxxxxxx' },
      },
     [Symbol('outHeadersKey')]: 
      { accept: [Array],
        'content-type': [Array],
        authorization: [Array],
        'user-agent': [Array],
        'content-length': [Array],
        host: [Array] } },
  },
  data: {
    token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    pageId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    pageURI: 'https://xxx.sg/m/xxxxxxxxxxxxxxxx/pay/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
};

const circularSample = {};
circularSample.c = circularSample;

let sinonSandbox = sinon.createSandbox();

describe('index.js ->', () => {
  describe('rdpLog.storeLog(log)', () => {
    it('should return both audit and console logs in an array', async () => {
      sinonSandbox = stubFirehoseInstance(sinonSandbox, 'createSuccessStub');
      rdpLog.log('product', 'user', 'summary', 'message');
      rdpLog.storeLog(nestedObjSample); // a nested object params
      rdpLog.storeLog(instantPayResSample); // a sample response params
      rdpLog.storeLog(circularSample); // a circular reference params
      rdpLog.storeLog(['log2', 'log3']); // an array param
      rdpLog.storeLog('log4', {testKey: "log5"}); // more than one params
      rdpLog.displayLog();
      expect(logArray).to.be.an('array');
      sinonSandbox.restore();
    });
  });
});;
