import Document from './Document'
import Folder from './Folder'
import type HttpClient from '../net/HttpClient'
import type ServiceManager from '../serviceDiscovery/ServiceManager'
import FileSystemSnapshot from './FileSystemSnapshot'

/**
 * reMarkable Cloud API {@link Document} payload
 *
 * Payload returned by API when requesting documents to `/doc/v2/files` endpoint
 */
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

/**
 * reMarkable Cloud API {@link Folder} payload
 *
 * Payload returned by API when requesting folders to `/doc/v2/files` endpoint
 */
export interface FolderPayload {
  id: string
  hash: string
  type: 'CollectionType'
  visibleName: string
  lastModified?: string
  parent?: string
  pinned: boolean
}

/**
 * Parses reMarkable Cloud API file system payload
 *
 * Maps the response payload from the API `/doc/v2/files` endpoint to a
 * set of {@link Document} and {@link Folder} instances. Recreates the
 * file system tree hierarchy, assigning to each {@link Document} and
 * folder its parent {@link Folder}.
 */
export class FileSystemParser {
  readonly #documentPayloads: DocumentPayload[]
  readonly #folderPayloads: FolderPayload[]
  readonly #documents: Document[]
  readonly #folders: Folder[]

  constructor (rawFileSystemPayload: Array<DocumentPayload | FolderPayload>) {
    this.#documentPayloads = rawFileSystemPayload.filter((payload) => payload.type === 'DocumentType') as DocumentPayload[]
    this.#folderPayloads = rawFileSystemPayload.filter((payload) => payload.type === 'CollectionType') as FolderPayload[]

    this.#folders = this.#folderPayloads.map((folderPayload) => {
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

    this.#documents = this.#documentPayloads.map((documentPayload) => {
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

    this.buildFileTreeHierarchy()
  }

  get documents (): Document[] {
    return this.#documents
  }

  get folders (): Folder[] {
    return this.#folders
  }

  private buildFileTreeHierarchy (): void {
    this.#folderPayloads.forEach((folderPayload) => {
      const folder = this.folders.find((f) => f.id === folderPayload.id)

      if (folderPayload.parent != null && folder.parentFolder == null) {
        folder.parentFolder = this.folders.find((f) => f.id === folderPayload.parent)
      }

      const folderDocumentPayloads = this.#documentPayloads.filter((documentPayload) => documentPayload.parent === folder.id)
      const folderDocuments = folderDocumentPayloads.map((documentPayload) => this.documents.find((d) => d.id === documentPayload.id))

      folderDocuments.forEach((document) => {
        document.folder = folder
        folder.documents.push(document)
      })

      const folderFolderPayloads = this.#folderPayloads.filter((folderPayload) => folderPayload.parent === folder.id)
      const folderFolders = folderFolderPayloads.map((folderPayload) => this.folders.find((f) => f.id === folderPayload.id))

      folderFolders.forEach((subFolder) => {
        subFolder.parentFolder = folder
        folder.folders.push(subFolder)
      })
    })
  }
}

/**
 * Represents the reMarkable Cloud API file system. Provides an
 * interface to retrieve the list of {@link Document}s and {@link Folder}s
 * in a user reMarkable Cloud account and navigate through them.
 *
 * The reMarkable API `/doc/v2/files` endpoint returns a list of all files
 * in a user reMarkable Cloud account with their respective metadata.
 *
 * The `FileSystem` class parses the API response and maps the file system
 * hierarchy to a set of {@link Document} and {@link Folder} instances,
 * providing a virtual recreation of the actual file system tree, which
 * can be then used to navigate through it in the similar way as in any
 * other file system.
 */
export default class FileSystem {
  readonly #serviceManager: ServiceManager

  #lastFetchSnapshot?: FileSystemSnapshot = null

  constructor (serviceManager: ServiceManager) {
    this.#serviceManager = serviceManager
  }

  get lastFetchSnapshot (): FileSystemSnapshot | undefined {
    return this.#lastFetchSnapshot
  }

  /**
   * Requests new reMarkable Cloud snapshot of all documents and folders in user account.
   */
  async snapshot (): Promise<FileSystemSnapshot> {
    this.#lastFetchSnapshot = await this.fetchSnapshot()
    return this.#lastFetchSnapshot
  }

  /**
   * Requests new reMarkable Cloud list of all documents in user account.
   *
   * Consider using {@link snapshot} method to get a snapshot of the entire file system
   * and fetch the documents from there instead of calling this method. Each document
   * request triggers a fetch call of the whole file system and the post-processing
   * of the response to build the file system tree. This is an expensive operation
   * that should be only invoked when changes have been made to the file system
   * (files uploaded, updated, deleted, etc).
   *
   * If no changes were uploaded to the reMarkable Cloud you should use the {@link snapshot}
   * method to get the list of documents and folders in the user account. The snapshot works
   * as a cache, and contains the file system information of the last request made to the
   * reMarkable Cloud API.
   */
  async document (id: string): Promise<Document | undefined> {
    const snapshot = await this.snapshot()
    return snapshot.documents.find((document) => document.id === id)
  }

  /**
   * Requests new reMarkable Cloud list of all folder in user account.
   *
   * Consider using {@link snapshot} method to get a snapshot of the entire file system
   * and fetch the folder from there instead of calling this method. Each folder
   * request triggers a fetch call of the whole file system and the post-processing
   * of the response to build the file system tree. This is an expensive operation
   * that should be only invoked when changes have been made to the file system
   * (files uploaded, updated, deleted, etc).
   *
   * If no changes were uploaded to the reMarkable Cloud you should use the {@link snapshot}
   * method to get the list of documents and folders in the user account. The snapshot works
   * as a cache, and contains the file system information of the last request made to the
   * reMarkable Cloud API.
   */
  async folder (id: string): Promise<Folder | undefined> {
    const snapshot = await this.snapshot()
    return snapshot.folders.find((folder) => folder.id === id)
  }

  private async fetchSnapshot (): Promise<FileSystemSnapshot> {
    const httpClient: HttpClient = await this.#serviceManager.internalCloudHttpClient()

    const response = await httpClient.get(
      '/doc/v2/files',
      { 'rm-source': 'RoR-Browser' }
    )

    if (response.status !== 200) {
      throw new Error(`Error during file system initialization: ${await response.text()}`)
    }

    const fileSystemPayload = JSON.parse(await response.text()) as Array<DocumentPayload | FolderPayload>
    const fileSystemParser = new FileSystemParser(fileSystemPayload)

    return new FileSystemSnapshot(fileSystemParser.documents, fileSystemParser.folders)
  }
}
