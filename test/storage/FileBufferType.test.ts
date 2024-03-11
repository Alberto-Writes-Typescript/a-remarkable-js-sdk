import { promises as fs } from 'fs'
import FileBufferType, { UnsupportedFileExtensionError } from '../../src/storage/FileBufferType'

describe('FileBufferType', () => {
  it('if supported file extension buffer is provided, returns instance with its extension and mime type', async () => {
    const pdfBuffer = await fs.readFile('./test/fixtures/documents/sample.pdf')
    const type = new FileBufferType(pdfBuffer)

    expect(type.extension).toBe('pdf')
    expect(type.mimeType).toBe('application/pdf')
  })

  it('if unsupported file extension buffer is provided, throws exception', async () => {
    const unsupportedBuffer = new ArrayBuffer(4)

    expect(() => new FileBufferType(unsupportedBuffer)).toThrow(UnsupportedFileExtensionError)
  })

  describe('#extension', () => {
    it('if PDF buffer is given, returns pdf', async () => {
      const pdfBuffer = await fs.readFile('./test/fixtures/documents/sample.pdf')
      const extension = FileBufferType.extension(pdfBuffer)

      expect(extension).toBe('pdf')
    })

    it('if ePub buffer is given, returns epub', async () => {
      const pdfBuffer = await fs.readFile('./test/fixtures/documents/sample.epub')
      const extension = FileBufferType.extension(pdfBuffer)

      expect(extension).toBe('epub')
    })

    it('if unsuported file extension buffer is given, throws exception', async () => {
      const unsupportedBuffer = new ArrayBuffer(4)

      expect(() => FileBufferType.extension(unsupportedBuffer)).toThrow(UnsupportedFileExtensionError)
    })
  })

  describe('#mimeType', () => {
    it('if PDF buffer is given, returns pdf mime type', async () => {
      const pdfBuffer = await fs.readFile('./test/fixtures/documents/sample.pdf')
      const extension = FileBufferType.mimeType(pdfBuffer)

      expect(extension).toBe('application/pdf')
    })

    it('if ePub buffer is given, returns epub mime type', async () => {
      const pdfBuffer = await fs.readFile('./test/fixtures/documents/sample.epub')
      const extension = FileBufferType.mimeType(pdfBuffer)

      expect(extension).toBe('application/epub+zip')
    })

    it('if unsuported file extension buffer is given, throws exception', async () => {
      const unsupportedBuffer = new ArrayBuffer(4)

      expect(() => FileBufferType.extension(unsupportedBuffer)).toThrow(UnsupportedFileExtensionError)
    })
  })
})
