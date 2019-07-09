# rdp-Auditlog
[![npm (scoped)](https://img.shields.io/npm/v/@reddotpay/rdp-auditlog.svg)](https://www.npmjs.com/package/@reddotpay/rdp-auditlog)

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
[String] data.message
```

##### Example
```
const rdpLog = require('@reddotpay/rdp-auditlog');

const data = {
    message: 'This is rdp audit log',
};

rdpLog.log(data);
rdpLog.info(data);
rdpLog.debug(data);
rdpLog.warn(data);
rdpLog.error(data);
```

##### Response
```
{
    status: "log success",
    recordId: "anUniqueRecordId"
}
```

##### Error
```
Validation Error: 
{
    status: "validation error",
    message: "validation error message"
}
```

```
Log Error: 
{
    status: "log failure",
    message: "log error message"
}
```