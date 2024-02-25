export function mockFetch (): jest.Mock {
  const mockFetch = jest.fn().mockResolvedValue(new Response())
  jest.spyOn(globalThis, 'fetch').mockImplementation(mockFetch)
  return mockFetch
}

export function restoreFetch (): void {
  if (jest.isMockFunction(globalThis.fetch)) {
    // @ts-ignore
    globalThis.fetch.mockRestore()
  } else {
    throw('You tried to restore fetch, but it was not a mock function.')
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
  const request = new Request(url.toString(), { method, headers, body: body ? JSON.stringify(body) : null })

  expect(mock).toHaveBeenCalledWith(request)
}
