import { FileBuffer, UnsupportedFileExtensionError } from '../../src/internal'
import ServiceManager from '../../src/serviceDiscovery/ServiceManager'
import { Session } from '../../src/authentication'

import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('FileBuffer', () => {
  let serviceManager: ServiceManager = null

  setupHttpRecording()

  beforeEach(() => {
    const session = new Session(global.unitTestParams.sessionToken as string)

    serviceManager = new ServiceManager(session)
  })

  describe('.upload', () => {
    it('given an e-pub file buffer, uploads file', async () => {
      const buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.epub', serviceManager)

      expect(buffer.uploaded).toBe(false)

      await buffer.upload()

      expect(buffer.uploaded).toBe(true)
      expect(buffer.documentReference).toBeDefined()
    }, 10000000)

    it('given a pdf file buffer, uploads file', async () => {
      const buffer = await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.pdf', serviceManager)

      expect(buffer.uploaded).toBe(false)

      await buffer.upload()

      expect(buffer.uploaded).toBe(true)
      expect(buffer.documentReference).toBeDefined()
    }, 10000000)

    it('given a incompatible file buffer, throws error', async () => {
      await expect(async () => {
        await FileBuffer.fromLocalFile('./test/fixtures/documents/sample.txt', serviceManager)
      }).rejects.toThrow(UnsupportedFileExtensionError)
    })
  })
})
