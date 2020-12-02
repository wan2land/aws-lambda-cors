# AWS Lambda CORS

<p>
  <a href="https://github.com/wan2land/aws-lambda-cors/actions?query=workflow%3A%22Node.js+CI%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/aws-lambda-cors/Node.js%20CI?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/aws-lambda-cors?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/aws-lambda-cors.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/aws-lambda-cors"><img alt="Version" src="https://img.shields.io/npm/v/aws-lambda-cors.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/aws-lambda-cors"><img alt="License" src="https://img.shields.io/npm/l/aws-lambda-cors.svg?style=flat-square" /></a>
  <br />
  <a href="https://david-dm.org/wan2land/aws-lambda-cors"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/aws-lambda-cors.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/aws-lambda-cors?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/aws-lambda-cors.svg?style=flat-square" /></a>
</p>

CORS Library for AWS Lambda with APIGateway.

## Installation

```bash
npm install aws-lambda-cors --save
```

## Usage

```typescript
import { cors } from 'aws-lambda-cors'

const originLambdaHandler = async (event, ctx) => {
  return {
    statusCode: 200,
    body: '',
  })
}

// Also OK.
//
// const originLambdaHandler = (event, ctx, callback) => {
//   callback(null, {
//     statusCode: 200,
//     body: '',
//   })
// }

export const lambdaHandler = cors({
  allowCredentials: true,
  allowOrigins: [
    'http://localhost:8000',
    'https://wani.kr',
  ],
  allowMethods: [
    'OPTIONS',
    'HEAD',
    'GET',
    'POST',
  ],
  allowHeaders: [
    'Authorization',
    'Content-Type',
  ],
  allowCredentials: true,
})(originLambdaHandler)
```
