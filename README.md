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
DISPLAY_AUDITLOG==***
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
rdp.log(...info);
rdp.error(errorObj, ...info);
await rdp.audit(event, response);
```

##### Example
```
// index.js

const rdp = require('@reddotpay/rdp-auditlog');

exports.handler = async (event) => {
    /*
        All the Lambda Routes
    */

    await rdp.audit(event, response);

    return response;
}
```

```
// models/test.js

const axios = require('axios');
const rdp = require('@reddotpay/rdp-auditlog');

axios.interceptors.request.use((request) => {
	rdp.log(request);
	return request;
});

axios.interceptors.response.use(response => response, (error) => {
	rdp.error(error);
	return error;
});

/*
    Axios Functions
*/
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

#### Additional Function
```
rdp.maskEmail(email);
rdp.maskCard(cardNumber);
rdp.maskString(string);
```

##### Example
```
const maskedEmail = rdp.maskEmail('username@domain.com');
// use*****@domain.com

const maskedCard = rdp.maskCard('1111222233334444');
// ****************

const maskedString = rdp.maskString('teststring');
// **********
```
