import { type HttpClientRequestBodyPayload } from '../../src/net/HttpClientRequestBody'

export function mockFetch (): jest.Mock {
  const mockFetch = jest.fn().mockResolvedValue(new Response())
  jest.spyOn(globalThis, 'fetch').mockImplementation(mockFetch)
  return mockFetch
}

export function restoreFetch (): void {
  if (jest.isMockFunction(globalThis.fetch)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    globalThis.fetch.mockRestore()
  } else {
    throw (new Error('You tried to restore fetch, but it was not a mock function.'))
  }
}

export function assertRequestPayload (
  mock: jest.Mock,
  host: string,
  path: string,
  method: string,
  headers: Record<string, string>,
  body: HttpClientRequestBodyPayload | null = null
): void {
  const url = new URL(path, host)

  /**
   * A `body` can consist of a string, a record, a `Buffer`-like variable or nothing.
   * The `record` body is the only one which requires some serialization to be processed.
   * This block of code assumes this fact to adapt to body to the format clients should send.
   */
  const serializedBody = body !== null
    ? ((typeof body === 'object') ? JSON.stringify(body) : body)
    : undefined

  const request = new Request(url.toString(), { method, headers, body: serializedBody })

  expect(mock).toHaveBeenCalledWith(request)
}
