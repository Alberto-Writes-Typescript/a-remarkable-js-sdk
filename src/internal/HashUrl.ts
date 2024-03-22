import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../ServiceManager'
import NodeClient from '../net/NodeClient'

/**
 * Error thrown when request to fetch `hash` download URL fails.
 */
export class HashPathRequestError extends Error {}

/**
 * Error thrown when request to fetch `hash` content fails.
 */
export class HashContentRequestError extends Error {}

/**
 * Error thrown when `hash` download URL method is not supported.
 */
export class InvalidHashUrlMethodError extends Error {}

/**
 * Error thrown when `hash` download URL has expired.
 */
export class ExpiredHashUrlError extends Error {}

/**
 * reMarkable API `/downloads` endpoint response payload
 *
 * Represents the URL to access the content of a `hash`.
 *
 * Download URLs are signed. The `hash` content is accessible
 * through an HTTP request to its `url` with the `method` specified
 * (no authentication required).
 *
 * Once the `expires` date is reached, the URL is no longer valid.
 */
export interface HashPathPayload {
  expires: string
  method: 'GET' | 'PUT' | 'PATCH'
  relative_path: string
  url: string
}

/**
 * Represents the URL to access the content of a `hash`.
 *
 * A `hash` is a string which uniquely identifies a piece of information in the
 * reMarkable cloud. A piece of information can be a `Document`, a `Folder`,
 * metadata associated to a `Document` or a `Folder`, etc.
 *
 * To access the content of a `hash`, the reMarkable API provides a `/downloads`
 * endpoint. This endpoint returns the download URL for a given `hash`. Download
 * URLs are signed URLs with an expiration date. When performing an HTTP request
 * to the download URL, the content of the `hash` is returned. Once the expiration
 * date is reached, the URL is no longer valid, requiring a new request to the
 * `/downloads` endpoint to get a new download URL.
 *
 * The `HashUrl` class provides an interface to download the content of a `hash`.
 */
export default class HashUrl {
  /**
   * Returns `HashUrl` for a given `hash`.
   *
   * @param {string} hash
   * @param {ServiceManager} serviceManager
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
   * Returns `HashUrl` for the `hash` associated to the root folder.
   *
   * The root folder represents the root path of the reMarkable cloud storage.
   *
   * @param {ServiceManager} serviceManager
   */
  static async fromRootHash (serviceManager: ServiceManager): Promise<HashUrl> {
    // Fetch the `hash` string associated to the `root` folder
    const urlForRootHash = await this.fromHash('root', serviceManager)
    const rootHashResponse = await urlForRootHash.fetch()
    const rootHash = await rootHashResponse.text()

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

  get expired (): boolean {
    return this.expires.getTime() < (new Date()).getTime()
  }

  async fetch (): Promise<Response> {
    if (this.expired) throw new ExpiredHashUrlError(`Error during hashUrl ${this.relativePath} content download request: link has expired`)

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
