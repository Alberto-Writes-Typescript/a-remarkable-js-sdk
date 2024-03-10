import { TextEncoder } from 'util'
import { promises as fs } from 'fs'
import { fromByteArray } from 'base64-js'
import type ServiceManager from '../ServiceManager'
import type HttpClient from '../net/HttpClient'
import HttpClientContext from '../net/HttpClientContext'
import { type FileTypeResult } from 'file-type'

/**
 * Response payload returned by reMarkable Cloud after uploading a file
 */
export interface UploadResponse {
  docID: string
  hash: string
}

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

  private httpClient?: HttpClient
  private uploadResponse?: UploadResponse

  private readonly name: string
  private readonly buffer: ArrayBuffer
  private readonly fileType?: FileTypeResult
  private readonly serviceManager: ServiceManager

  constructor (name: string, buffer: ArrayBuffer, serviceManager: ServiceManager) {
    this.name = name
    this.buffer = buffer
    this.serviceManager = serviceManager
  }

  async upload (): Promise<unknown> {
    const httpClient = await this.internalCloudHttpClient()

    const response = await httpClient.post(
      '/doc/v2/files',
      this.buffer,
      new HttpClientContext(null, {
        'content-type': 'application/epub+zip', // await this.mimeType(),
        'rm-meta': this.encodedName,
        'rm-source': 'RoR-Browser'
      })
    )

    if (response.status !== 201) {
      throw new Error(`Failed to find Remarkable API Storage Service: ${await response.text()}`)
    }

    this.uploadResponse = await response.json() as UploadResponse

    return this.uploadResponse
  }

  private async internalCloudHttpClient (): Promise<HttpClient> {
    this.httpClient ||= await this.serviceManager.internalCloudHttpClient()
    return this.httpClient
  }

  private get encodedName (): string {
    const encoder = new TextEncoder()
    const namePayload = JSON.stringify({ file_name: this.name })
    const encodedNamePayload = encoder.encode(namePayload)
    return fromByteArray(encodedNamePayload)
  }
}
