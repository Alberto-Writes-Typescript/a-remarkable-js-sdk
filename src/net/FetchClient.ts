export class FetchClient {
  async makeRequest (
    host: string,
    path: string,
    method: string = 'GET',
    headers: Record<string, string> = {},
    body: string = null
  ) {
    const url = new URL(path, host)
    const response = await this.fetchMethod(url.toString(), { method, headers, body })
    return response
  }

  private get fetchMethod () { return globalThis.fetch }
}
