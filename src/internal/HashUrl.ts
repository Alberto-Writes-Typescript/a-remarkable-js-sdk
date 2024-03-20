import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../ServiceManager'
import NodeClient from '../net/NodeClient'

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
 * Models the signed URL to access the contents of a `Document` or `Folder`.
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
      throw new Error(`Failed to fetch Remarkable API hash: ${await response.text()}`)
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
    try {
      const urlForRootHash = await this.fromHash('root', serviceManager)
      const rootHash = await urlForRootHash.fetchContent()
      return await this.fromHash(rootHash, serviceManager)
    } catch (error) {
      throw new Error(`Failed to fetch Remarkable API root hash: ${error.message}`)
    }
  }

  expires: Date
  method: 'GET' | 'PUT' | 'PATCH'
  rawContent?: string = null
  relativePath: string
  url: URL

  constructor (hashPathPayload: HashPathPayload) {
    this.expires = Date.parse(hashPathPayload.expires) as unknown as Date
    this.method = hashPathPayload.method
    this.relativePath = hashPathPayload.relative_path
    this.url = new URL(hashPathPayload.url)
  }

  get valid (): boolean {
    return this.expires > new Date()
  }

  async fetchContent (): Promise<string> {
    const response = await NodeClient.get(this.url.origin, this.url.pathname + this.url.search)

    if (response.status !== 200) {
      throw new Error(`Failed to fetch Remarkable API file hash: ${await response.text()}`)
    }

    return await response.text()
  }
}
