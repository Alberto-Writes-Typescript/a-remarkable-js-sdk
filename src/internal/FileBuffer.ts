import { TextEncoder } from 'fast-text-encoding'
import { promises as fs } from 'fs'
import { fromByteArray } from 'base64-js'

import FileBufferType from './FileBufferType'
import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../serviceDiscovery/ServiceManager'

export class FileNotUploadedError extends Error {}

/**
 * Response payload returned by reMarkable Cloud after uploading a file
 */
export interface UploadResponsePayload {
  docID: string
  hash: string
}

/**
 * Represents a reference to an uploaded { @link Document }
 *
 * In the reMarkable Cloud API, documents are identified by a unique
 * ID and Hash. While the ID is always the same, the hash changes
 * conforming changes are pushed to the user account file system.
 *
 * The { @link DocumentReference } class parses the reMarkable Cloud
 * API success upload response and returns a reference to the uploaded
 * document.
 */
export class DocumentReference {
  public readonly id: string
  public readonly hash: string

  constructor (id: string, hash: string) {
    this.id = id
    this.hash = hash
  }
}

/**
 * Represents a file content, encoded as a buffer, ready to be uploaded
 * to reMarkable Cloud.
 *
 * Encapsulates the logic to handle file upload. Given the Buffer
 * content of a file, it verifies the type compatibility with the
 * reMarkable Cloud API and provides an interface to upload the file
 * and get a reference to its cloud equivalent when successfully
 * pushed.
 */
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

  /**
   * Creates FileBuffer from file Buffer and uploads it
   *
   * @param name - File name
   * @param buffer - File content
   * @param serviceManager
   */
  static async upload (name: string, buffer: Buffer, serviceManager: ServiceManager): Promise<FileBuffer> {
    const fileBuffer = new FileBuffer(name, buffer, serviceManager)
    await fileBuffer.upload()
    return fileBuffer
  }

  public readonly name: string
  public readonly buffer: Buffer
  public readonly type: FileBufferType
  public documentReference?: DocumentReference

  private httpClient?: HttpClient
  private readonly serviceManager: ServiceManager

  constructor (name: string, buffer: Buffer, serviceManager: ServiceManager) {
    this.name = name
    this.buffer = buffer
    this.serviceManager = serviceManager

    this.type = new FileBufferType(buffer)
  }

  get uploaded (): boolean {
    return this.documentReference != null
  }

  async upload (): Promise<DocumentReference> {
    const httpClient = await this.internalCloudHttpClient()

    const response = await httpClient.post(
      '/doc/v2/files',
      this.buffer,
      {
        'content-type': this.type.mimeType,
        'rm-meta': this.encodedName,
        'rm-source': 'RoR-Browser'
      }
    )

    if (response.status !== 201) {
      throw new FileNotUploadedError(`Failed to upload file to reMarkable Cloud: ${await response.text()}`)
    }

    const uploadResponsePayload = await response.json() as UploadResponsePayload

    this.documentReference = new DocumentReference(uploadResponsePayload.docID, uploadResponsePayload.hash)

    return this.documentReference
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
