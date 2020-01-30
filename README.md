# rdp-Auditlog
[![npm (scoped)](https://img.shields.io/npm/v/@reddotpay/rdp-auditlog.svg)](https://www.npmjs.com/package/@reddotpay/rdp-auditlog)

Audit log npm package for RDP products

### Install
1. `npm install @reddotpay/rdp-auditlog dotenv`
2. `npm install aws-sdk --save-dev`
3. refer to *Sample Environment File* for environment variables

##### Sample Environment File
```
ENVIRONMENT=development | staging | production
DELIVERY_STREAM_NAME=$RDP_AUDITLOGS_STREAM_DEV | $RDP_AUDITLOGS_STREAM | $RDP_AUDITLOGS_STREAM_PROD
DISPLAY_AUDITLOG=true
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

#### Primary Function
```
/*
    DATA TYPE
    summmary {string} - description of log / error
    variable {any} - the variable to log
    error {object} - error object return in catch block
    event {object} - lambda event
    response {object} - response that is return to frontend
*/

Function 1: rdp.log(summary, variable); - equivalent to console.log
Function 2: rdp.error(summary, error); - equivalent to console.error
Function 3: await rdp.audit(event, response); - only called once before lambda return response
```

##### Example
```
// index.js

const rdp = require('@reddotpay/rdp-auditlog');

exports.handler = async (event) => {
    /*
        All the Lambda Routes
    */

    await rdp.audit(event, response); <==== fn 3

    return response;
}
```

```
// models/test.js

const axios = require('axios');
const rdp = require('@reddotpay/rdp-auditlog');

class test {
    async get(input) {
        try {
            rdp.log('test get route>>', input); <==== fn 1
            ...
        } catch (e) {
            rdp.error('test get route error>>', e); <==== fn 2
            ...
        }

        return;
    }

    async post(input) {
        try {
            rdp.log('test get route>>', input); <==== fn 1
            ...
        } catch (e) {
            rdp.error('test get route error>>', e); <==== fn 2
            ...
        }

        return;
    }
}
```

##### Response
```
{
    FailedPutCount: 0,
    Encrypted: false,
    RequestResponses: [{
        RecordId: 'streamId',
    }],
}
```

#### Masking Function
```
rdp.maskReturnDefault();
rdp.maskEmail(email);
rdp.maskCard(cardNumber);
rdp.maskString(string);
rdp.maskObject(object);
```

##### Example
```
const maskReturnDefault = rdp.maskReturnDefault();
// ****************
remarks: default is always 16 asterisk

const maskedEmail = rdp.maskEmail('username@domain.com');
// use*****@domain.com

const maskedCard = rdp.maskCard('1111222233334444');
// ****************

const maskedString = rdp.maskString('teststring');
// **********

const maskedObject = rdp.maskObject({
    key1: "value1",
    key2: [1, 2, 3],
    key3: {
        nestedKey1: "nestedValue1",
        nestedKey2: "nestedValue2",
    },
});
/*
{
    key1: ****************,
    key2: ****************,
    key3: ****************,
}
*/
```
