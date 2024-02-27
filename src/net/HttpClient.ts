// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class HttpClient {
  public static async get (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement get static method')
  }

  public static async post (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement post static method')
  }

  public static async patch (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement patch static method')
  }

  public static async put (
    host: string,
    path: string,
    headers: Record<string, string> = {},
    body: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement put static method')
  }

  public static async delete (
    host: string,
    path: string,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    throw new Error('HTTP Client does not implement delete static method')
  }
}
