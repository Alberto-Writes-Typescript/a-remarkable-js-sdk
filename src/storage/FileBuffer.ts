import { TextEncoder } from 'util'
import { fromByteArray } from 'base64-js'
import NodeClient from '../net/NodeClient'
import type HttpClient from '../net/HttpClient'
import type Device from '../authentication/Device'

export const SYNCHRONIZATION_HOST: string = 'https://internal.cloud.remarkable.com'

export default class FileBuffer {
  private readonly httpClient: HttpClient

  constructor (device: Device) {
    this.device = device
    this.httpClient = new NodeClient(SYNCHRONIZATION_HOST, { Authorization: `Bearer ${this.device.sessionToken.token}` })
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
      buffer,
      {
        headers: {
          Authorization: `Bearer ${this.device.sessionToken.token}`,
          'content-type': contentType,
          'rm-meta': fromByteArray(meta),
          'rm-source': 'RoR-Browser'
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
