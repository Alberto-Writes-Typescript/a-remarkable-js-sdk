import type HashUrl from './HashUrl'

const DOCUMENT_TYPE = '0'
const FOLDER_TYPE = '80000000'

export default abstract class Entry {
  static async fromFolderHashUrl (folderHashUrl: HashUrl): Promise<Entry[]> {
    const content = await folderHashUrl.fetchContent()
    return this.fromFolderHashUrlContent(content)
  }

  static fromFolderHashUrlContent (folderHashUrlContent: string): Entry[] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [schemaVersion, ...lines] = folderHashUrlContent.slice(0, -1).split('\n')

    // TODO: Add Schema Version Validation
    return lines.map((line) => {
      const [hash, type, documentId, subfiles, size] = line.split(':')

      switch (type) {
        case DOCUMENT_TYPE:
          console.log('me llama')
          return new DocumentEntry(hash, documentId, BigInt(size))
        case FOLDER_TYPE:
          return new FolderEntry(hash, documentId, BigInt(size), parseInt(subfiles))
        default:
          throw new Error(`Unknown entry type: ${type}`)
      }
    })
  }

  hash: string
  id: string
  size: bigint

  constructor (hash: string, id: string, size: bigint) {
    this.hash = hash
    this.id = id
    this.size = size
  }
}

export class DocumentEntry extends Entry {}

export class FolderEntry extends Entry {
  subfiles: number

  constructor (hash: string, id: string, size: bigint, subfiles: number) {
    super(hash, id, size)
    this.subfiles = subfiles
  }
}
