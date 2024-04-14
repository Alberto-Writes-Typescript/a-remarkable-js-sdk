import { Device, Session } from './authentication'
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

  readonly #device: Device
  #serviceManager: ServiceManager
  #session: Session

  constructor (deviceToken: string, sessionToken?: string, httpClientConstructor: unknown = NodeClient) {
    this.#device = new Device(deviceToken)
    if (sessionToken != null) {
      this.#session = new Session(sessionToken)
      this.#serviceManager = new ServiceManager(this.session, httpClientConstructor)
    }
  }

  get device (): Device {
    return this.#device
  }

  get session (): Session {
    return this.#session
  }

  async connect (): Promise<void> {
    if (this.sessionExpired) {
      this.#session = await this.device.connect()
      this.#serviceManager = new ServiceManager(this.session)
    }
  }

  async fileSystem (): Promise<FileSystem> {
    return await FileSystem.initialize(this.#serviceManager)
  }

  async document (id: string): Promise<Document | undefined> {
    const fileSystem = await this.fileSystem()
    return fileSystem.document(id)
  }

  async folder (id: string): Promise<Folder | undefined> {
    const fileSystem = await this.fileSystem()
    return fileSystem.folder(id)
  }

  async upload (name: string, buffer: Buffer): Promise<DocumentReference> {
    const fileBuffer = new FileBuffer(name, buffer, this.#serviceManager)
    return await fileBuffer.upload()
  }

  get sessionExpired (): boolean {
    return this.session == null || this.session.expired
  }
}
