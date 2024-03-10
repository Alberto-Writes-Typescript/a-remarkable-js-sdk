import { TextEncoder } from 'util'
import { promises as fs } from 'fs'
import { fromByteArray } from 'base64-js'
import type ServiceManager from '../ServiceManager'
import type HttpClient from '../net/HttpClient'
import HttpClientContext from '../net/HttpClientContext'
import { type FileTypeResult } from 'file-type'

export default class FileBuffer {
  /**
   * Creates a FileBuffer from a local file
   *
   * Used to easily upload local files to reMarkable cloud
   *
   * @param {string} path
   * @param {ServiceManager} serviceManager
   */
  static async fromLocalFile (path: string, serviceManager: ServiceManager): Promise<FileBuffer> {
    const name = path.split('/').pop()
    const buffer = await fs.readFile(path)

    return new FileBuffer(name, buffer, serviceManager)
  }

  private uploadResponse?: never
  private httpClient?: HttpClient
  private readonly fileType?: FileTypeResult

  private readonly name: string
  private readonly buffer: ArrayBuffer
  private readonly serviceManager: ServiceManager

  constructor (name: string, buffer: ArrayBuffer, serviceManager: ServiceManager) {
    this.name = name
    this.buffer = buffer
    this.serviceManager = serviceManager
  }

  async upload (): Promise<unknown> {
    const httpClient = await this.documentStorageHttpClient()

    // @ts-expect-error TODO: fix Response type definition
    this.uploadResponse = await httpClient.post(
      '/doc/v2/files',
      this.buffer,
      new HttpClientContext('https://internal.cloud.remarkable.com', {
        'content-type': 'application/epub+zip', // await this.mimeType(),
        'rm-meta': this.encodedName,
        'rm-source': 'RoR-Browser'
      })
    )

    // @ts-expect-error TODO: fix Response type definition
    if (this.uploadResponse.status !== 201) {
      // @ts-expect-error TODO: fix Response type definition
      throw new Error(`Failed to find Remarkable API Storage Service: ${this.uploadResponse.statusText}`)
    }

    return this.uploadResponse
  }

  private async documentStorageHttpClient (): Promise<HttpClient> {
    this.httpClient ||= await this.serviceManager.documentStorageHttpClient()
    return this.httpClient
  }

  private get encodedName (): string {
    const encoder = new TextEncoder()
    const namePayload = JSON.stringify({ file_name: this.name })
    const encodedNamePayload = encoder.encode(namePayload)
    return fromByteArray(encodedNamePayload)
  }
}
