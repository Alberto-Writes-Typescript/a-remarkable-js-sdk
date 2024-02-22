export class FetchClient {
  public async makeRequest (
    host: string,
    path: string,
    method: string = 'GET',
    headers: Record<string, string> = {},
    body: string = null
  ) {
    const url = new URL(path, host)
    const response = await fetch(url.toString(), { method, headers, body })
    return response
  }
}
