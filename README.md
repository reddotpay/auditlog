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

##### Example
```
const rdpLog = require('@reddotpay/rdp-auditlog');

rdpLog.log(product, user, message);
rdpLog.info(product, user, message);
rdpLog.debug(product, user, message);
rdpLog.warn(product, user, message);
rdpLog.error(product, user, message);
```

##### Parameters
```
product     [String]
user        [String]    (default="root")
message     [Any]
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
