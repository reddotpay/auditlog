# rdp-Auditlog
[![npm (scoped)](https://img.shields.io/npm/v/@reddotpay/rdp-auditlog.svg)](https://www.npmjs.com/package/@reddotpay/rdp-auditlog)

Audit log npm package for RDP products

### Install
1. `npm install @reddotpay/rdp-auditlog`
2. refer to `.env.example` for environment variables

### Requirements

##### Policy ARN
```
arn:aws:iam::aws:policy/AmazonKinesisFirehoseFullAccess
```

### Usage

##### Data Types
```
[Object]                    data
[String]                    data.product
[String](default="root")    data.user
[Any]                       data.message
```

##### Example
```
const rdpLog = require('@reddotpay/rdp-auditlog');

const data = {
    product: 'rdpProductName',
    user: 'userId',
    message: 'This is log message',
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
    createdAt: "UTC Timestamp",
    flag: "info",
    product: "rdpProductName",
    user: "userId",
    message: "This is log message"
}
```
