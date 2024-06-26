import FileSystem, { type DocumentPayload, FileSystemParser, type FolderPayload } from '../../src/internal/FileSystem'
import ServiceManager from '../../src/serviceDiscovery/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import { Session } from '../../src'

/**
 * - file-without-parent
 * - folder-1
 *   |- folder-1-file-1
 *   |- folder-1-subfolder-1
 *     |- subfolder-1-file-1
 */
const sampleFileSystemPayload: Array<DocumentPayload | FolderPayload> = [
  {
    id: 'file-without-parent',
    hash: 'file-without-parent',
    type: 'DocumentType',
    visibleName: 'file-without-parent',
    fileType: 'pdf',
    lastModified: '2021-01-01T00:00:00.000Z',
    lastOpened: '2021-01-01T00:00:00.000Z',
    pinned: true
  },
  {
    id: 'folder-1',
    hash: 'folder-1',
    type: 'CollectionType',
    visibleName: 'folder-1',
    lastModified: '2021-01-01T00:00:00.000Z',
    pinned: true
  },
  {
    id: 'folder-1-file-1',
    hash: 'folder-1-file-1',
    type: 'DocumentType',
    visibleName: 'folder-1-file-1',
    fileType: 'pdf',
    lastModified: '2021-01-01T00:00:00.000Z',
    lastOpened: '2021-01-01T00:00:00.000Z',
    parent: 'folder-1',
    pinned: true
  },
  {
    id: 'folder-1-subfolder-1',
    hash: 'folder-1-subfolder-1',
    type: 'CollectionType',
    visibleName: 'folder-1-subfolder-1',
    lastModified: '2021-01-01T00:00:00.000Z',
    parent: 'folder-1',
    pinned: true
  },
  {
    id: 'subfolder-1-file-1',
    hash: 'subfolder-1-file-1',
    type: 'DocumentType',
    visibleName: 'subfolder-1-file-1',
    fileType: 'pdf',
    lastModified: '2021-01-01T00:00:00.000Z',
    lastOpened: '2021-01-01T00:00:00.000Z',
    parent: 'folder-1-subfolder-1',
    pinned: true
  }
]

describe('FileSystemParser', () => {
  it('parses folders', () => {
    const fileSystemParser = new FileSystemParser(sampleFileSystemPayload)

    expect(fileSystemParser.folders.length).toBe(2)
    expect(fileSystemParser.folders.map((folder) => folder.name))
      .toEqual(['folder-1', 'folder-1-subfolder-1'])
  })

  it('parses folder metadata', () => {
    const fileSystemParser = new FileSystemParser(sampleFileSystemPayload)

    const folder1 = fileSystemParser.folders.find((folder) => folder.name === 'folder-1')

    expect(folder1.id).toBe('folder-1')
    expect(folder1.hash).toBe('folder-1')
    expect(folder1.name).toBe('folder-1')
    expect(folder1.lastModified.toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('parses documents', () => {
    const fileSystemParser = new FileSystemParser(sampleFileSystemPayload)

    expect(fileSystemParser.documents.length).toBe(3)
    expect(fileSystemParser.documents.map((document) => document.name))
      .toEqual(['file-without-parent', 'folder-1-file-1', 'subfolder-1-file-1'])
  })

  it('parses document metadata', () => {
    const fileSystemParser = new FileSystemParser(sampleFileSystemPayload)

    const fileWithoutParent = fileSystemParser.documents.find((document) => document.name === 'file-without-parent')

    expect(fileWithoutParent.id).toBe('file-without-parent')
    expect(fileWithoutParent.hash).toBe('file-without-parent')
    expect(fileWithoutParent.name).toBe('file-without-parent')
    expect(fileWithoutParent.fileType).toBe('pdf')
    expect(fileWithoutParent.lastModified.toISOString()).toBe('2021-01-01T00:00:00.000Z')
    expect(fileWithoutParent.lastOpened.toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('builds file tree hierarchy', () => {
    const fileSystemParser = new FileSystemParser(sampleFileSystemPayload)

    const fileWithoutParent = fileSystemParser.documents.find((document) => document.name === 'file-without-parent')
    expect(fileWithoutParent.folder).toBeNull()

    const folder1 = fileSystemParser.folders.find((folder) => folder.name === 'folder-1')
    expect(folder1.documents.length).toBe(1)
    expect(folder1.documents[0].id).toBe('folder-1-file-1')
    expect(folder1.folders.length).toBe(1)
    expect(folder1.folders[0].id).toBe('folder-1-subfolder-1')

    const folder1File1 = fileSystemParser.documents.find((document) => document.name === 'folder-1-file-1')
    expect(folder1File1.folder.id).toBe('folder-1')

    const folder1Subfolder1 = fileSystemParser.folders.find((folder) => folder.name === 'folder-1-subfolder-1')
    expect(folder1Subfolder1.documents.length).toBe(1)
    expect(folder1Subfolder1.documents[0].id).toBe('subfolder-1-file-1')
    expect(folder1Subfolder1.folders.length).toBe(0)
    expect(folder1Subfolder1.parentFolder.id).toBe('folder-1')

    const subfolder1File1 = fileSystemParser.documents.find((document) => document.name === 'subfolder-1-file-1')
    expect(subfolder1File1.folder.id).toBe('folder-1-subfolder-1')
  })
})

describe('FileSystem', () => {
  let serviceManager: ServiceManager = null
  let fileSystem: FileSystem = null

  setupHttpRecording()

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const session = new Session(global.unitTestParams.sessionToken)

    serviceManager = new ServiceManager(session)
    fileSystem = new FileSystem(serviceManager)
  })

  describe('document', () => {
    it('if there is a document with given ID, returns document', async () => {
      const document = await fileSystem.document(global.unitTestParams.sampleDocumentId as string)

      expect(document).not.toBeNull()
      expect(document.id).toBe(global.unitTestParams.sampleDocumentId as string)
    })
  })

  describe('folder', () => {
    it('if there is a folder with given ID, returns folder', async () => {
      const folder = await fileSystem.folder(global.unitTestParams.sampleFolderId as string)

      expect(folder).not.toBeNull()
      expect(folder.id).toBe(global.unitTestParams.sampleFolderId as string)
    })
  })
})
