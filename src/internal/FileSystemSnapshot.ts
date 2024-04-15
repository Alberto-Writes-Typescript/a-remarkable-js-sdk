import type Document from './Document'
import type Folder from './Folder'

/**
 * Represents a snapshot of the reMarkable Cloud API file system.
 *
 * Provides a list of all { @link Document }s and { @link Folder }s in
 * the user's reMarkable Cloud account in a specific point in time.
 *
 * A snapshot is valid as long as the user does not perform any write
 * operations on the reMarkable Cloud file system. As soon a file in
 * the system is uploaded or modified, all the files hashes are modify,
 * causing the snapshot to be de-synchornized with the actual reMarkable
 * Cloud file system.
 *
 * You can see the snapshot as a cache of the reMarkable Cloud file system.
 */
export default class FileSystemSnapshot {
  /**
   * List of all {@link Document}s in user reMarkable Cloud account
   */
  readonly #documents: Document[]
  /**
   * List of all {@link Folder}s in user reMarkable Cloud account
   */
  readonly #folders: Folder[]

  constructor (documents: Document[], folders: Folder[]) {
    this.#documents = documents
    this.#folders = folders
  }

  get documents (): Document[] {
    return this.#documents
  }

  get folders (): Folder[] {
    return this.#folders
  }

  get rootFolder (): Folder {
    return this.#folders.find((folder) => folder.parentFolder == null)
  }

  document (id: string): Document | undefined {
    return this.#documents.find((document) => document.id === id)
  }

  folder (id: string): Folder | undefined {
    return this.#folders.find((folder) => folder.id === id)
  }
}
