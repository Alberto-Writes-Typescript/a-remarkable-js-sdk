import { promises as fs } from 'fs'
import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import FileManager from '../../src/storage/FileManager'

async function readFileAsArrayBuffer(filePath: string): Promise<ArrayBuffer> {
  const data = await fs.readFile(filePath)
  return data.buffer
}

describe('FileManager', () => {
  describe('.uploadEpub', () => {
    it('if valid epub file is provided, uploads file', async () => {
      const device = new Device(
        process.env.SAMPLE_UUID,
        'browser-chrome',
        new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)
      )

      await device.connect()

      const fileManager = new FileManager(device)

      const buffer = await readFileAsArrayBuffer('./test/fixtures/documents/sample.epub')

      const response = await fileManager.uploadEpub('sample.epub', buffer)

      console.log(response)
    })
  })
})
