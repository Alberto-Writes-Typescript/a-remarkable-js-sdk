import { Device, Session } from './authentication'
import FileBuffer from './internal/FileBuffer'
import FileSystem from './internal/FileSystem'
import ServiceManager from './serviceDiscovery/ServiceManager'

export default class RemarkableClient {
  device: Device
  session: Session
  serviceManager: ServiceManager

  constructor (deviceToken: string, sessionToken?: string) {
    this.device = new Device(deviceToken)
    if (sessionToken != null) {
      this.session = new Session(sessionToken)
      this.serviceManager = new ServiceManager(this.session)
    }
  }

  async connect (): Promise<void> {
    if (this.sessionExpired) {
      this.session = await this.device.connect()
      this.serviceManager = new ServiceManager(this.session)
    }
  }

  async fileSystem (): Promise<FileSystem> {
    return await FileSystem.initialize(this.serviceManager)
  }

  async file (id: string): Promise<File> {
    const fileSystem = await this.fileSystem()
    return fileSystem.file(id)
  }

  async upload (name: string, buffer: ArrayBuffer): Promise<any> {
    const fileBuffer = new FileBuffer(name, buffer, this.serviceManager)
    return await fileBuffer.upload()
  }

  private get sessionExpired (): boolean {
    return this.session == null || this.session.expired
  }
}
