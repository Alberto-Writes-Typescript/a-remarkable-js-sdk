import * as https from 'https'

export function mockHttpsRequest (
  host: string,
  path: string,
  method: string,
  headers: Record<string, string>,
  body: Record<string, string> | null = null
): any {
  const hostname = (new URL(path, host)).hostname
  const options = { hostname, path, method, headers }

  const mockHttpsRequest = jest
    .spyOn(https, 'request')
    // @ts-ignore
    .mockImplementation((opts, callback) => {
      expect(opts).toEqual(options)

      const mockResponse = {
        statusCode: 200, headers: {},
        on: jest.fn().mockImplementation((event, eventCallback) => {
          if (event === 'data') {
            eventCallback(JSON.stringify({ data: 'mock data' }))
          }
          if (event === 'end') {
            eventCallback()
          }
        })
      }

      // @ts-ignore
      callback(mockResponse)

      return mockResponse
    })

  return mockHttpsRequest
}

export function restoreHttpsRequest (): void {
  // @ts-ignore
  if (jest.isMockFunction(https.request)) {
    // @ts-ignore
    https.request.mockRestore()
  } else {
    throw('You tried to restore fetch, but it was not a mock function.')
  }
}

export function assertRequestPayload (mock: jest.Mock): void {
  expect(mock).toHaveBeenCalled()
}