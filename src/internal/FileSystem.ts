import Document from './Document'
import Folder from './Folder'
import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../ServiceManager'

export interface DocumentPayload {
  hash: string
  id: string
  type: 'DocumentType'
  fileType: 'pdf' | 'epub' | 'notebook'
  visibleName: string
  lastModified?: string
  lastOpened?: string
  parent?: string
  pinned: boolean
}

export interface FolderPayload {
  id: string
  hash: string
  type: 'CollectionType'
  visibleName: string
  lastModified?: string
  parent?: string
  pinned: boolean
}

export class FileSystemParser {
  documentPayloads: DocumentPayload[]
  folderPayloads: FolderPayload[]
  documents: Document[]
  folders: Folder[]

  constructor (rawFileSystemPayload: Array<DocumentPayload | FolderPayload>) {
    this.documentPayloads = rawFileSystemPayload.filter((payload) => payload.type === 'DocumentType') as DocumentPayload[]
    this.folderPayloads = rawFileSystemPayload.filter((payload) => payload.type === 'CollectionType') as FolderPayload[]

    this.parse()
  }

  private parse (): void {
    this.parseFolders()
    this.parseDocuments()
    this.buildFileTreeHierarchy()
  }

  private parseFolders (): void {
    this.folders = this.folderPayloads.map((folderPayload) => {
      return new Folder(
        folderPayload.id,
        folderPayload.hash,
        folderPayload.visibleName,
        (folderPayload.lastModified != null) ? new Date(folderPayload.lastModified) : null,
        undefined,
        [],
        []
      )
    })
  }

  private parseDocuments (): void {
    this.documents = this.documentPayloads.map((documentPayload) => {
      return new Document(
        documentPayload.id,
        documentPayload.hash,
        documentPayload.visibleName,
        documentPayload.fileType,
        (documentPayload.lastModified != null) ? new Date(documentPayload.lastModified) : null,
        (documentPayload.lastOpened != null) ? new Date(documentPayload.lastOpened) : null,
        null
      )
    })
  }

  private buildFileTreeHierarchy (): void {
    this.folderPayloads.forEach((folderPayload) => {
      const folder = this.folders.find((f) => f.id === folderPayload.id)

      if (folderPayload.parent != null && folder.parentFolder == null) {
        folder.parentFolder = this.folders.find((f) => f.id === folderPayload.parent)
      }

      const folderDocumentPayloads = this.documentPayloads.filter((documentPayload) => documentPayload.parent === folder.id)
      const folderDocuments = folderDocumentPayloads.map((documentPayload) => this.documents.find((d) => d.id === documentPayload.id))

      folderDocuments.forEach((document) => {
        document.folder = folder
        folder.documents.push(document)
      })

      const folderFolderPayloads = this.folderPayloads.filter((folderPayload) => folderPayload.parent === folder.id)
      const folderFolders = folderFolderPayloads.map((folderPayload) => this.folders.find((f) => f.id === folderPayload.id))

      folderFolders.forEach((subFolder) => {
        subFolder.parentFolder = folder
        folder.folders.push(subFolder)
      })
    })
  }
}

export default class FileSystem {
  static async initialize (serviceManager: ServiceManager): Promise<FileSystem> {
    const httpClient: HttpClient = await serviceManager.internalCloudHttpClient()

    const response = await httpClient.get(
      '/doc/v2/files',
      { 'rm-source': 'RoR-Browser' }
    )

    if (response.status !== 200) {
      throw new Error(`Error during file system initialization: ${await response.text()}`)
    }

    const fileSystemPayload = JSON.parse(await response.text()) as Array<DocumentPayload | FolderPayload>
    const fileSystemParser = new FileSystemParser(fileSystemPayload)

    return new FileSystem(fileSystemParser.documents, fileSystemParser.folders)
  }

  documents: Document[] = []
  folders: Folder[] = []

  constructor (documents: Document[], folders: Folder[]) {
    this.documents = documents
    this.folders = folders
  }
}
