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
  body: Record<string, string> | null = null
): void {
  const url = new URL(path, host)
  const request = new Request(url.toString(), { method, headers, body: (body != null) ? JSON.stringify(body) : null })

  expect(mock).toHaveBeenCalledWith(request)
}
