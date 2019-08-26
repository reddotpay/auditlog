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

=== Audit Log ===
await rdpLog.log(product, user, summary, message);
await rdpLog.info(product, user, summary, message);
await rdpLog.debug(product, user, summary, message);
await rdpLog.warn(product, user, summary, message);
await rdpLog.error(product, user, summary, message);

=== Developer Log ===
rdpLog.storeLog(log);
rdpLog.displayLog(); // to be called at the end
```

##### Parameters
```
product     [String]
user        [String]    (default="root")
summary     [String]
message     [Any]
log         [Any]
```

##### Response
```
{
    createdAt: "UTC Timestamp",
    flag: "info",
    product: "rdpProductName",
    user: "userId",
    summary: "${user} did a [POST] / [PUT] / [PATCH] / [DELETE] on ${product} at ${createdAt}",
    message: "This is log message"
}
```
