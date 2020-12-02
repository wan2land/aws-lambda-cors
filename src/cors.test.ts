import { cors } from './cors'


describe('testsuite cors', () => {
  it('test empty preflight', async () => {
    const handler = cors()(() => {
      throw new Error('should not be called')
    })

    await expect(handler({ httpMethod: 'OPTIONS' } as any, null as any, null as any)).resolves.toEqual({
      statusCode: 204,
      headers: {},
      body: '',
    })
  })

  it('test preflight', async () => {
    const handler = cors({
      allowOrigins: 'https://wani.kr',
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['X-Something-Foo', 'X-Something-Bar'],
      allowCredentials: true,
      exposedHeaders: ['x-exposed-header-1', 'x-exposed-header-2'],
      maxAge: 180,
    })(() => {
      throw new Error('should not be called')
    })

    await expect(handler({ httpMethod: 'OPTIONS', headers: { origin: 'https://wani.kr' } } as any, null as any, null as any)).resolves.toEqual({
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-Something-Foo,X-Something-Bar',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Origin': 'https://wani.kr',
        'Access-Control-Expose-Headers': 'x-exposed-header-1,x-exposed-header-2',
        'Access-Control-Max-Age': '180',
        'Vary': 'Origin',
      },
      body: '',
    })
  })

  it('test promise handler', async () => {
    const handler = cors({
      allowOrigins: 'https://wani.kr',
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['X-Something-Foo', 'X-Something-Bar'],
      allowCredentials: true,
      exposedHeaders: ['x-exposed-header-1', 'x-exposed-header-2'],
      maxAge: 180,
    })(() => {
      return Promise.resolve({
        statusCode: 200,
        body: ':-)',
      })
    })

    await expect(handler({ httpMethod: 'GET', headers: { origin: 'https://wani.kr' } } as any, null as any, null as any)).resolves.toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-Something-Foo,X-Something-Bar',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Origin': 'https://wani.kr',
        'Access-Control-Expose-Headers': 'x-exposed-header-1,x-exposed-header-2',
        'Access-Control-Max-Age': '180',
        'Vary': 'Origin',
      },
      body: ':-)',
    })
  })

  it('test callback handler', async () => {
    const handler = cors({
      allowOrigins: 'https://wani.kr',
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['X-Something-Foo', 'X-Something-Bar'],
      allowCredentials: true,
      exposedHeaders: ['x-exposed-header-1', 'x-exposed-header-2'],
      maxAge: 180,
    })((event, context, callback) => {
      callback(null, {
        statusCode: 200,
        body: ':-)',
      })
    })

    await expect(handler({ httpMethod: 'GET', headers: { origin: 'https://wani.kr' } } as any, null as any, null as any)).resolves.toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'X-Something-Foo,X-Something-Bar',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Origin': 'https://wani.kr',
        'Access-Control-Expose-Headers': 'x-exposed-header-1,x-exposed-header-2',
        'Access-Control-Max-Age': '180',
        'Vary': 'Origin',
      },
      body: ':-)',
    })
  })
})
