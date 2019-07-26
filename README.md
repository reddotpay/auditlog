# rdp-Auditlog
[![npm (scoped)](https://img.shields.io/npm/v/@reddotpay/rdp-auditlog.svg)](https://www.npmjs.com/package/@reddotpay/rdp-auditlog)

Audit log npm package for RDP products

### Install
1. `npm install @reddotpay/rdp-auditlog`
2. refer to `.env.example` for environment variables

### Requirements
AWS Role can refer to either *Managed Policy ARN* or *Policy* below.

##### Managed Policy ARN
```
arn:aws:iam::aws:policy/AmazonKinesisFirehoseFullAccess
```
##### Policy
```
Type: AWS::IAM::Role
Properties:
    AssumeRolePolicyDocument:
    Version: '2012-10-17'
    Statement:
    - Effect: Allow
        Principal:
        Service:
            - lambda.amazonaws.com
        Action:
        - 'sts:AssumeRole'
    Policies:
    - PolicyDocument:
        Version: '2012-10-17'
        Statement:
        - Effect: Allow
            Action:
            - 'lambda:*'
            - 'firehose:*'
            - 'logs:*'
            - 'ec2:*'
            Resource: '*'
```

### Usage

##### Example
```
const rdpLog = require('@reddotpay/rdp-auditlog');

await rdpLog.log(product, user, message);
await rdpLog.info(product, user, message);
await rdpLog.debug(product, user, message);
await rdpLog.warn(product, user, message);
await rdpLog.error(product, user, message);
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
