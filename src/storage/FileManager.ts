import { fromByteArray } from 'base64-js'
import type Device from '../authentication/Device'
import type HttpClient from '../net/HttpClient'
import NodeClient from '../net/NodeClient'
// TODO: remove this ASAP and require it only when running in Node mode
import { TextEncoder } from 'util'

export const SYNCHRONIZATION_HOST: string = 'https://internal.cloud.remarkable.com'

export default class FileManager {
  public readonly device: Device
  public readonly httpClient: HttpClient

  constructor (device: Device) {
    this.device = device

    // TODO: add logic to pass a specific client
    this.httpClient = new NodeClient(
      SYNCHRONIZATION_HOST, {
        Authorization: `Bearer ${this.device.sessionToken.token}`
      }
    )
  }

  public async uploadEpub (name: string, fileBuffer: ArrayBuffer): Promise<unknown> {
    return await this.uploadFile(name, fileBuffer, 'application/epub+zip')
  }

  private async uploadFile (
    name: string,
    buffer: ArrayBuffer,
    contentType: `application/${'epub+zip' | 'pdf'}`
  ): Promise<unknown> {
    const encoder = new TextEncoder()
    const meta = encoder.encode(JSON.stringify({ file_name: name }))

    const uploadResponse = await this.httpClient.post(
      '/doc/v2/files',
      // @ts-expect-error TODO: fix body type
      { buffer },
      {
        headers: {
          'content-type': contentType,
          'rm-meta': fromByteArray(meta),
          'rm-source': 'RoR-Browser',
          Authorization: `Bearer ${this.device.sessionToken.token}`
        }
      }
    )

    if (uploadResponse.status !== 201) {
      throw new Error(`Failed to find Remarkable API Storage Service: ${uploadResponse.statusText}`)
    }

    const uploadPayload: unknown = await uploadResponse.json()

    return uploadPayload
  }
}
