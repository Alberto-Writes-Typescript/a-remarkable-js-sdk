import Device from '../../src/authentication/Device'
import FileBuffer from '../../src/./internal/FileBuffer'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('FileBuffer', () => {
  let serviceManager: ServiceManager = null

  setupHttpRecording()

  beforeEach(async () => {
    const device = new Device(process.env.SAMPLE_PAIR_TOKEN)

    await device.connect()

    serviceManager = new ServiceManager(device)
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
