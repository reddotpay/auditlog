# rdp-Auditlog
Audit log npm package for RDP products

### Install
```npm install @reddotpay/rdp-auditlog```

### Requirements

##### Policy ARN
```
arn:aws:iam::aws:policy/AmazonKinesisFirehoseFullAccess
```

### Usage

##### Data Types
```
[Object] data
[String] data.flag [accepted: 'log', 'debug', 'info', 'warn', 'error']
[String] data.message
[Date]   data.createdAt
```

##### Example
```
const rdpLog = require('@reddotpay/rdp-auditlog');

const data = {
    flag: 'info',
    message: 'This is rdp audit log',
    createdAt: new Date(),
};

rdpLog.doPutRecord(data);
```
