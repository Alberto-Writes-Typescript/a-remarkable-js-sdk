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
