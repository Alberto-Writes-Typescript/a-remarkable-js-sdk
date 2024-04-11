import * as https from 'https'

export function mockHttpsRequest (
  host: string,
  path: string,
  method: string,
  headers: Record<string, string>,
  body: Record<string, string> | null = null
): jest.Mock {
  const hostname = (new URL(path, host)).hostname
  const options = { hostname, path, method, headers, body }

  const mockHttpsRequest = jest
    .spyOn(https, 'request')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .mockImplementation((opts, callback) => {
      // @ts-expect-error - Expected error
      expect({ ...opts, body }).toEqual(options)

      const mockResponse = {
        statusCode: 200,
        headers: {},
        on: jest.fn().mockImplementation((event, eventCallback) => {
          if (event === 'data') {
            eventCallback(JSON.stringify({ data: 'mock data' }))
          }
          if (event === 'end') {
            eventCallback()
          }
        })
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      callback(mockResponse)

      return mockResponse
    })

  return mockHttpsRequest as jest.Mock
}

export function restoreHttpsRequest (): void {
  if (jest.isMockFunction(https.request)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    https.request.mockRestore()
  } else {
    throw (new Error('You tried to restore fetch, but it was not a mock function.'))
  }
}

export function assertRequestPayload (mock: jest.Mock): void {
  expect(mock).toHaveBeenCalled()
}
