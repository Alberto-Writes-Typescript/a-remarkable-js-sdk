import FileSystemSnapshot, { type DocumentPayload, FileSystemParser, type FolderPayload } from '../../src/internal/FileSystem'

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
] as Array<DocumentPayload | FolderPayload>

describe('FileSystemSnapshot', () => {
  let snapshot: FileSystemSnapshot = null

  beforeAll(() => {
    const parser = new FileSystemParser(sampleFileSystemPayload)
    snapshot = new FileSystemSnapshot(parser.documents, parser.folders)
  })

  describe('document', () => {
    it('if there is a document with given ID, returns document', async () => {
      const document = snapshot.document('file-without-parent')

      expect(document).not.toBeNull()
      expect(document.id).toBe('file-without-parent')
    })

    it('if there is no document with given ID, returns null', async () => {
      expect(snapshot.document('non-existent-document')).not.toBeDefined()
    })
  })

  describe('folder', () => {
    it('if there is a folder with given ID, returns folder', async () => {
      const folder = snapshot.folder('folder-1')

      expect(folder).not.toBeNull()
      expect(folder.id).toBe('folder-1')
    })

    it('if there is no folder with given ID, returns null', async () => {
      expect(snapshot.folder('non-existent-folder')).not.toBeDefined()
    })
  })
})
