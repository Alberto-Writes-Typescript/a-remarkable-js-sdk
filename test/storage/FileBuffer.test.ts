import Device from '../../src/authentication/Device'
import FileBuffer from '../../src/storage/FileBuffer'
import ServiceManager from '../../src/ServiceManager'
import DeviceToken from '../../src/authentication/DeviceToken'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('FileBuffer', () => {
  setupHttpRecording()

  describe('.upload', () => {
    it('given an e-pub file buffer, uploads file', async () => {
      const device = new Device(process.env.SAMPLE_UUID, 'browser-chrome', new DeviceToken(process.env.SAMPLE_PAIR_TOKEN))

      await device.connect()

      const serviceManager = new ServiceManager(device)
      const buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.epub', serviceManager)

      await buffer.upload()
    }, 10000000)
  })
})
