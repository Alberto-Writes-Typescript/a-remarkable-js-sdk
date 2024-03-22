import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../ServiceManager'
import NodeClient from '../net/NodeClient'

/**
 * Error thrown when request to fetch `hash` signed download URL fails.
 *
 * Request takes place during `HashUrl` initialization.
 */
export class HashPathRequestError extends Error {}

/**
 * Error thrown when request to fetch `HashUrl` content fails.
 */
export class HashContentRequestError extends Error {}

/**
 * Error thrown when an invalid method is provided to the `HashUrl` class.
 */
export class InvalidHashUrlMethodError extends Error {}

/**
 * Error thrown when trying to fetch the content of a `HashUrl` object whole link has expired.
 */
export class ExpiredHashUrlError extends Error {}

/**
 * Response payload of the reMarkable Cloud API `downloads` endpoint.
 *
 * Represents a signed URL to access the contents of the `Document` or
 * `Folder` whose `string` `hash` was provided in the endpoint request.
 */
export interface HashPathPayload {
  expires: string
  method: 'GET' | 'PUT' | 'PATCH'
  relative_path: string
  url: string
}

/**
 * Models the signed URL to access the contents of a `Document` or `Folder` `Entries`.
 */
export default class HashUrl {
  /**
   * Given a `string` `hash`, representing a `Document` of `Folder`, returns its `HashUrl`.
   *
   * @param hash
   * @param serviceManager
   */
  static async fromHash (hash: string, serviceManager: ServiceManager): Promise<HashUrl> {
    const httpClient: HttpClient = await serviceManager.internalCloudHttpClient()

    const response = await httpClient.post(
      '/sync/v2/signed-urls/downloads',
      { http_method: 'GET', relative_path: hash }
    )

    if (response.status !== 200) {
      throw new HashPathRequestError(`Error during hash ${hash} download URL request: ${await response.text()}`)
    }

    return new HashUrl(await response.json() as HashPathPayload)
  }

  /**
   * Return the `HashUrl` for the root folder.
   *
   * The root folder is a special folder identifier with the `root` relative path.
   *
   * To get its `HashUrl` it is required to first fetch the `string` `hash`
   * associated to the root folder, and then the `HashUrl` of that `hash`.
   *
   * @param {ServiceManager} serviceManager
   */
  static async fromRootHash (serviceManager: ServiceManager): Promise<HashUrl> {
    // Fetch the `hash` string associated to the `root` folder
    const urlForRootHash = await this.fromHash('root', serviceManager)
    const rootHash = await urlForRootHash.fetchText()

    // And then extract the `HashUrl` from the actual root `hash`
    return await this.fromHash(rootHash, serviceManager)
  }

  expires: Date
  method: 'GET' | 'PUT' | 'PATCH'
  relativePath: string
  url: URL

  constructor (hashPathPayload: HashPathPayload) {
    this.expires = new Date(Date.parse(hashPathPayload.expires))
    this.method = hashPathPayload.method
    this.relativePath = hashPathPayload.relative_path
    this.url = new URL(hashPathPayload.url)
  }

  get valid (): boolean {
    return this.expires.getTime() > (new Date()).getTime()
  }

  async fetchText (): Promise<string> {
    const response = await this.fetch()

    return await response.text()
  }

  private async fetch (): Promise<Response> {
    if (!this.valid) throw new ExpiredHashUrlError(`Error during hashUrl ${this.relativePath} content download request: link has expired`)

    let response = null

    switch (this.method) {
      case 'GET':
        response = await NodeClient.get(this.url.href, this.url.pathname + this.url.search)
        break
      default:
        throw new InvalidHashUrlMethodError(`Error during hashUrl ${this.relativePath} content download request: method ${this.method} not supported`)
    }

    if (response.status !== 200) {
      throw new HashContentRequestError(`Error during hashUrl ${this.relativePath} content download request: ${await response.text()}`)
    }

    return response
  }
}
