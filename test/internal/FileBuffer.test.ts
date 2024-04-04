import FileBuffer from '../../src/./internal/FileBuffer'
import ServiceManager from '../../src/serviceDiscovery/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import { Session } from '../../src'

describe('FileBuffer', () => {
  let testParameters = null
  let serviceManager: ServiceManager = null

  setupHttpRecording()

  beforeEach(() => {
    testParameters = JSON.parse(process.env.UNIT_TEST_DATA)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = new Session(testParameters.sessionToken)

    serviceManager = new ServiceManager(session)
  })

  describe('.upload', () => {
    it('given an e-pub file buffer, uploads file', async () => {
      const buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.epub', serviceManager)

      await buffer.upload()

      expect(buffer.uploaded).toBe(true)
    }, 10000000)

    it('given a pdf file buffer, uploads file', async () => {
      const buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.pdf', serviceManager)

      await buffer.upload()

      expect(buffer.uploaded).toBe(true)
    }, 10000000)
  })
})
