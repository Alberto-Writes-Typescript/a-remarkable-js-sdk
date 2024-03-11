import Device from '../../src/authentication/Device'
import ServiceManager from '../../src/ServiceManager'
import DeviceToken from '../../src/authentication/DeviceToken'
import FileBuffer, { FileNoUploadedError } from '../../src/storage/FileBuffer'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('FileBuffer', () => {
  let buffer: FileBuffer = null

  setupHttpRecording()

  beforeEach(async () => {
    const device = new Device(
      process.env.SAMPLE_UUID,
      'browser-chrome',
      new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)
    )

    await device.connect()

    const serviceManager = new ServiceManager(device)

    buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.epub', serviceManager)
  })

  describe('.upload', () => {
    it('given an e-pub file buffer, uploads file', async () => {
      await buffer.upload()

      expect(buffer.uploaded).toBe(true)
    }, 10000000)
  })

  describe('.remarkableDocumentId', () => {
    it('if FileBuffer is uploaded, returns document ID', async () => {
    }, 10000000)

    it('if FileBuffer is not uploaded, throws exception', async () => {
      expect(() => buffer.remarkableDocumentId).toThrow(FileNoUploadedError)
    })
  })

  describe('.remarkableDocumentHash', () => {
    it('if FileBuffer is uploaded, returns document Hash', async () => {
    }, 10000000)

    it('if FileBuffer is not uploaded, throws exception', async () => {
      expect(() => buffer.remarkableDocumentHash).toThrow(FileNoUploadedError)
    })
  })
})
