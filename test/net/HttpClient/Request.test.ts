import Request from '../../../src/net/HttpClient/Request'

describe('Request', () => {
  it('parses Http request host and path into an URL object', () => {
    const host = 'https://example.com'
    const path = '/api/v1'

    const request = new Request(host, path, 'GET')

    expect(request.url).toBeInstanceOf(URL)
    expect(request.url.href).toBe(`${host}${path}`)
  })

  it('serializes Http request body', () => {
    const host = 'https://example.com'
    const path = '/api/v1'
    const body = { key: 'value' }

    const request = new Request(host, path, 'POST', null, body)

    expect(request.body).toEqual(JSON.stringify(body))
  })
})
