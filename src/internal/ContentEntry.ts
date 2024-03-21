import ServiceManager from '../ServiceManager'

export default class ContentEntry {
  static suffix (): string {
    return 'content'
  }

  serviceManager: ServiceManager
}
