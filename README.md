# rdp-Auditlog
[![npm (scoped)](https://img.shields.io/npm/v/@reddotpay/rdp-auditlog.svg)](https://www.npmjs.com/package/@reddotpay/rdp-auditlog)

Audit log npm package for RDP products

### Install
1. `npm install @reddotpay/rdp-auditlog`
2. refer to *Sample Environment File* for environment variables

### Install *(local development)*
1. `npm install @reddotpay/rdp-auditlog`
2. `npm install dotenv aws-sdk --save-dev`
3. refer to *Sample Environment File*  for environment variables

##### Sample Environment File
```
ENVIRONMENT=***
DELIVERY_STREAM_NAME=***
```

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

Audit:      rdpLog.log(product, user, summary, message);
Developer:  rdpLog.storeLog(log);

await rdpLog.displayLog(); // must be called once at the end
```

##### Parameters
```
product     [String]
user        [String]    (default="root")
summary     [String]
message     [Any]
log         [Any]
```

##### Debug
```
const returnResponse = await rdpLog.displayLog();

console.log(returnResponse);
```

##### Response
```
returnResponse:
{
    FailedPutCount: 0,
    Encrypted: false,
    RequestResponses: [{
        RecordId: 'streamId',
    }],
}
```
###### Console Log
```
// Audit

`Audit Log: Successfully streamed ${numberOfLog} audit log`
```
```
// Developer
[
    ['log 1'],
    ['log 2'],
    ...
]
```
