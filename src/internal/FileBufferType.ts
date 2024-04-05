/**
 * The reMarkable API only works with `.pdf` and `.epub` files. This error is
 * raised when an `ArrayBuffer` with an unsupported file extension is passed to
 * the `FileBufferType` class.
 */
export class UnsupportedFileExtensionError extends Error {}

/**
 * Each `ArrayBuffer` presents a specific signature representing its corresponding
 * file type at the beginning. This constants list the signature for each one of
 * the supported file types.
 */
const BUFFER_TYPE_SIGNATURES = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  epub: [0x50, 0x4b, 0x03, 0x04]
}

/**
 * Maps each file type to its corresponding MIME type.
 */
const MIME_TYPE_MAPS = {
  pdf: 'application/pdf',
  epub: 'application/epub+zip'
}

/**
 * Represents the type of the file associated to its buffer.
 *
 * It is possible to identify the type of a file by examining its buffer.
 * This class encapsulates the logic to infer a files type from its
 * respective buffer.
 *
 * Since the reMarkable Cloud API only allows uploading `.pdf` and `.epub`
 * files, the class only handles buffers with that extension, raising an
 * { @link UnsupportedFileExtensionError } when a buffer from an unsupported
 * file extension is passed.
 */
export default class FileBufferType {
  static extension (buffer: ArrayBuffer): 'pdf' | 'epub' {
    const signature = (new Uint8Array(buffer)).slice(0, 4)

    for (const [type, sig] of Object.entries(BUFFER_TYPE_SIGNATURES)) {
      if (signature.every((byte, index) => byte === sig[index])) {
        return type as 'pdf' | 'epub'
      }
    }

    throw new UnsupportedFileExtensionError('Unsupported file extension. Only .pdf and .epub files are supported.')
  }

  static mimeType (buffer: ArrayBuffer): string {
    const type = this.extension(buffer)
    return MIME_TYPE_MAPS[type]
  }

  /**
   * Buffer file extension
   */
  readonly extension: string
  /**
   * MIME type of the buffer file
   */
  readonly mimeType: string

  constructor (buffer: ArrayBuffer) {
    this.extension = FileBufferType.extension(buffer)
    this.mimeType = FileBufferType.mimeType(buffer)
  }
}
