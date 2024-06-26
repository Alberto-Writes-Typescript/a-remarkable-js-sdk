import NodeClient from '../net/NodeClient'
import type HttpClient from '../net/HttpClient'
import { type HeadersPayload } from '../net/HttpClient/Headers'
import { type Session } from '../authentication'

const SERVICE_DISCOVERY_HOST: string = 'https://service-manager-production-dot-remarkable-production.appspot.com'

const REMARKABLE_API_SERVICES: Record<string, string> = {
  documentStorage: '/service/json/1/document-storage?environment=production&group=auth0%7C5a68dc51cb30df3877a1d7c4&apiVer=2'
}

/**
 * Response payload returned by the `/service` reMarkable API endpoint.
 */
interface ServiceManagerResponse {
  Status: 'OK' | string
  Host: string
}

/**
 * Generates `HttpClient` instances preconfigured for performing
 * requests to the different services available in the reMarkable
 * Cloud API.
 *
 * Each service in the reMarkable Cloud API (such as authentication,
 * document storage, ...) has a specific host. The `/service` API
 * endpoint allows developers to fetch the these hosts. This class
 * provides a public interface of methods representing all the
 * services available in the API.
 *
 * Use these methods to get instances of the `HttpClient` configured
 * with the corresponding host and authentication headers for the
 * service you want to make use of.
 */
export default class ServiceManager {
  /**
   * Returns `HttpClient` configured with host and header options to
   * perform requests to the reMarkable production API.
   *
   * This API endpoint is not a service per-se, but provides some similar
   * utilities other services provide (such as device pairing or session
   * creation). To keep the logic to fetch endpoints consistent, this
   * method encapsulates the endpoint logic as if it was another service.
   *
   * Some of the utilities the endpoint provide does not require from
   * any headers. By defining this method as static, we can make use
   * of this endpoint without requiring a `Device` instance (as it
   * is required for other endpoints).
   */
  static productionHttpClient (
    headers: HeadersPayload = {},
    HttpClientConstructor: unknown = NodeClient
  ): HttpClient {
    // @ts-expect-error - httpClientConstructor is a constructor
    return new HttpClientConstructor('https://webapp-prod.cloud.remarkable.engineering', headers)
  }

  public readonly session: Session
  public readonly httpClient: HttpClient

  constructor (session: Session, HttpClientConstructor: unknown = NodeClient) {
    this.session = session

    // @ts-expect-error - httpClientConstructor is a constructor
    this.httpClient = new HttpClientConstructor(SERVICE_DISCOVERY_HOST, {
      Authorization: `Bearer ${this.session.token}`
    })
  }

  /**
   * Returns `HttpClient` configured with host and header options to
   * perform requests to the reMarkable Document Storage API service.
   */
  public async documentStorageHttpClient (): Promise<HttpClient> {
    return await this.serviceHttpClient('documentStorage')
  }

  /**
   * Returns `HttpClient` configured with host and header options to
   * perform requests to the reMarkable internal API.
   *
   * This API endpoint is not a service per-se, but provides some similar
   * utilities other services provide (such as file upload). To keep the
   * logic to fetch endpoints consistent, this method encapsulates the
   * endpoint logic as if it was another service.
   */
  public async internalCloudHttpClient (): Promise<HttpClient> {
    return await new Promise((resolve, reject = () => {}) => {
      resolve(
        new NodeClient(
          'https://internal.cloud.remarkable.com',
          { Authorization: `Bearer ${this.session.token}` }
        )
      )

      reject(new Error('Not implemented'))
    })
  }

  private async serviceHttpClient (service: string): Promise<HttpClient> {
    const discoveryResponse = await this.httpClient.get(REMARKABLE_API_SERVICES[service])

    if (discoveryResponse.status !== 200) {
      throw new Error(
        `Failed to find Remarkable API ${service} Service:
        ${discoveryResponse.statusText} - ${await discoveryResponse.text()}`
      )
    }

    const discoveryPayload: ServiceManagerResponse = await discoveryResponse.json()

    return new NodeClient(
      `https://${discoveryPayload.Host}`,
      { Authorization: `Bearer ${this.session.token}` }
    )
  }
}
