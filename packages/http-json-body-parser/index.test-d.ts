import { APIGatewayEvent, APIGatewayProxyEventV2 } from 'aws-lambda'
import middy from '@middy/core'
import { expectType } from 'tsd'
import jsonBodyParser from '.'

// use with default options
let middleware = jsonBodyParser()
expectType<middy.MiddlewareObj<APIGatewayEvent | APIGatewayProxyEventV2>>(middleware)

// use with all options
middleware = jsonBodyParser({
  reviver: (key: string, value: any) => Boolean(value)
})
expectType<middy.MiddlewareObj<APIGatewayEvent | APIGatewayProxyEventV2>>(middleware)

const baseEvent: Omit<APIGatewayEvent, 'body'> = {
  headers: {},
  isBase64Encoded: false,
  httpMethod: 'GET',
  path: '/',
  multiValueHeaders: {},
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: null,
    protocol: '',
    httpMethod: '',
    path: '',
    stage: '',
    requestId: '',
    requestTimeEpoch: 0,
    resourceId: '',
    resourcePath: '',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '',
      user: null,
      userAgent: null,
      userArn: null
    }
  },
  resource: ''
}

// allow body to only be string or null
middleware = jsonBodyParser()
const middifiedHandler = middy(() => {}).use(middleware)

expectType<Promise<void>>(middifiedHandler({
  ...baseEvent,
  body: 'string'
}, {} as any))
expectType<Promise<void>>(middifiedHandler({
  ...baseEvent,
  body: null
}, {} as any))

middifiedHandler({
  ...baseEvent,
  // @ts-expect-error
  body: {}
}, {} as any).then(() => {}).catch(() => {})

// allow specifying the event type
const apiGatewayV1Middleware = jsonBodyParser<APIGatewayEvent>()
expectType<middy.MiddlewareObj<APIGatewayEvent>>(apiGatewayV1Middleware)
const apiGatewayV2Middleware = jsonBodyParser<APIGatewayProxyEventV2>()
expectType<middy.MiddlewareObj<APIGatewayProxyEventV2>>(apiGatewayV2Middleware)
