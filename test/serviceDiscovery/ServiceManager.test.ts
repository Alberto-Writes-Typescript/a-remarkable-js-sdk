import HttpClient from '../../src/net/HttpClient'
import { Session, ServiceManager } from '../../src'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('ServiceManager', () => {
  let session: Session = null
  let serviceManager: ServiceManager = null

  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  beforeEach(() => {
    session = new Session(process.env.SAMPLE_SESSION_TOKEN)
    serviceManager = new ServiceManager(session)
  })

  describe('.documentStorageHttpClient', () => {
    it('if Device is connected, returns HttpClient instance with document storage configuration', async () => {
      const client = await serviceManager.documentStorageHttpClient()

      expect(client)
        .toBeInstanceOf(HttpClient)
      expect(client.context.host)
        .toBe('https://document-storage-production-dot-remarkable-production.appspot.com')
      expect(JSON.stringify(client.context.headers.entries))
        .toBe(JSON.stringify({ Authorization: `Bearer ${session.token}` }))
    }, 5000)
  })

  describe('.internalCloudHttpClient', () => {
    it('if Device is connected, returns HttpClient instance with internal cloud configuration', async () => {
      const client = await serviceManager.internalCloudHttpClient()

      expect(client)
        .toBeInstanceOf(HttpClient)
      expect(client.context.host)
        .toBe('https://internal.cloud.remarkable.com')
      expect(JSON.stringify(client.context.headers.entries))
        .toBe(JSON.stringify({ Authorization: `Bearer ${session.token}` }))
    }, 5000)
  })
})
