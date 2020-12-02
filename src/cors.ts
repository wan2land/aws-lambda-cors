import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'


export interface CorsParams {
  statusCode?: number
  allowOrigins?: string | string[]
  allowMethods?: string | string[]
  allowHeaders?: string | string[]
  allowCredentials?: boolean
  maxAge?: number
  exposedHeaders?: string | string[]
}

export type APIGatewayLambdaHandler = ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>)
| ((event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>)
| ((event: APIGatewayProxyEvent, context: Context, callback: (error?: Error | string | null, result?: APIGatewayProxyResult) => void) => void)


/**
 * @ref https://github.com/expressjs/cors/blob/master/lib/index.js
 */
export function cors(params: CorsParams = {}): (handler: APIGatewayLambdaHandler) => APIGatewayLambdaHandler {
  const baseResponseHeaders = {} as Record<string, string>

  if (params.allowMethods && params.allowMethods.length > 0) {
    baseResponseHeaders['Access-Control-Allow-Methods'] = (Array.isArray(params.allowMethods) ? params.allowMethods : [params.allowMethods]).join(',')
  }

  if (params.allowHeaders && params.allowHeaders.length > 0) {
    baseResponseHeaders['Access-Control-Allow-Headers'] = (Array.isArray(params.allowHeaders) ? params.allowHeaders : [params.allowHeaders]).join(',')
  }

  if (params.allowCredentials) {
    baseResponseHeaders['Access-Control-Allow-Credentials'] = 'true'
  }

  if (typeof params.maxAge === 'number') {
    baseResponseHeaders['Access-Control-Max-Age'] = `${params.maxAge}`
  }

  if (params.exposedHeaders && params.exposedHeaders.length > 0) {
    baseResponseHeaders['Access-Control-Expose-Headers'] = (Array.isArray(params.exposedHeaders) ? params.exposedHeaders : [params.exposedHeaders]).join(',')
  }

  return (handler) => (event, context, _cb) => {
    const eventHeaders = Object.entries(event.headers || {}).reduce((carry, [headerName, header]) => {
      carry[headerName.toLowerCase()] = header
      return carry
    }, {} as Record<string, string>)
    const responseHeaders = Object.assign({}, baseResponseHeaders)
    const varyHeaders = []

    if (params.allowOrigins && params.allowOrigins.length > 0) {
      const requestOrigin = eventHeaders.origin
      if (typeof requestOrigin === 'string') {
        const allowOrigins = Array.isArray(params.allowOrigins) ? params.allowOrigins : [params.allowOrigins]
        if (allowOrigins.includes('*')) {
          responseHeaders['Access-Control-Allow-Origin'] = '*'
        } else if (allowOrigins.includes(requestOrigin)) {
          responseHeaders['Access-Control-Allow-Origin'] = requestOrigin
          varyHeaders.push('Origin')
        } else {
          responseHeaders['Access-Control-Allow-Origin'] = 'false'
          varyHeaders.push('Origin')
        }
      }
    }

    if (params.allowHeaders && params.allowHeaders.length > 0) {
      responseHeaders['Access-Control-Allow-Headers'] = (Array.isArray(params.allowHeaders) ? params.allowHeaders : [params.allowHeaders]).join(',')
    } else if (eventHeaders['access-control-request-headers']) {
      responseHeaders['Access-Control-Allow-Headers'] = eventHeaders['access-control-request-headers']
      varyHeaders.push('Access-Control-Request-Headers')
    }

    if (varyHeaders.length > 0) {
      responseHeaders.Vary = varyHeaders.join(',')
    }

    // preflight
    if (event.httpMethod === 'OPTIONS') {
      return Promise.resolve({
        statusCode: params.statusCode ?? 204,
        headers: responseHeaders,
        body: '',
      })
    }

    return new Promise<APIGatewayProxyResult>((resolve, reject) => {
      const response = handler(event, context, (error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
      if (response && response.then) { // promise like
        Promise.resolve(response).then(resolve).catch(reject)
      }
    }).then(result => {
      if (result) {
        result.headers = Object.assign(result.headers ?? {}, responseHeaders)
      }
      return result
    })
  }
}
