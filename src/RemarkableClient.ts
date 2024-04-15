import { Device, type DeviceDescription, Session } from './authentication'
import { type Folder, type Document } from './internal'
import FileBuffer, { type DocumentReference } from './internal/FileBuffer'
import FileSystem from './internal/FileSystem'
import FetchClient from './net/FetchClient'
import NodeClient from './net/NodeClient'
import ServiceManager from './serviceDiscovery/ServiceManager'

/**
 * reMarkable Cloud API client.
 *
 * Provides an interface to interact with the reMarkable Cloud API:
 * - Navigate through the file system
 * - Upload documents
 */
export default class RemarkableClient {
  static withFetchHttpClient (deviceToken: string, sessionToken?: string): RemarkableClient {
    return new RemarkableClient(deviceToken, sessionToken, FetchClient)
  }

  static withNodeHttpClient (deviceToken: string, sessionToken?: string): RemarkableClient {
    return new RemarkableClient(deviceToken, sessionToken, NodeClient)
  }

  readonly #HttpClientConstructor: unknown

  #device: Device
  #fileSystem: FileSystem
  #serviceManager: ServiceManager
  #session: Session

  constructor (deviceToken?: string, sessionToken?: string, httpClientConstructor: unknown = NodeClient) {
    if (deviceToken != null) {
      this.#device = new Device(deviceToken)

      if (sessionToken != null) {
        this.#session = new Session(sessionToken)
        this.#serviceManager = new ServiceManager(this.session, httpClientConstructor)
        this.#fileSystem = new FileSystem(this.#serviceManager)
      }
    } else {
      this.#HttpClientConstructor = httpClientConstructor
    }
  }

  get device (): Device {
    return this.#device
  }

  get session (): Session {
    return this.#session
  }

  async pair (id: string, description: DeviceDescription, oneTimeCode: string): Promise<boolean> {
    if (!this.paired) {
      this.#device = await Device.pair(
        id,
        description,
        oneTimeCode,
        this.#HttpClientConstructor
      )
    }

    return this.paired
  }

  async connect (): Promise<void> {
    if (this.sessionExpired) {
      this.#session = await this.device.connect()
      this.#serviceManager = new ServiceManager(this.session)
      this.#fileSystem = new FileSystem(this.#serviceManager)
    }
  }

  async document (id: string): Promise<Document | undefined> {
    return await this.#fileSystem.document(id)
  }

  async folder (id: string): Promise<Folder | undefined> {
    return await this.#fileSystem.folder(id)
  }

  async upload (name: string, buffer: Buffer): Promise<DocumentReference> {
    const fileBuffer = new FileBuffer(name, buffer, this.#serviceManager)
    return await fileBuffer.upload()
  }

  get sessionExpired (): boolean {
    return this.session == null || this.session.expired
  }

  get paired (): boolean {
    return this.session != null
  }
}
