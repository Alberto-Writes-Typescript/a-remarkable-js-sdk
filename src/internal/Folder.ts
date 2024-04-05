import type Document from './Document'

/**
 * Represents a reMarkable Cloud folder
 */
export default class Folder {
  id: string
  hash: string
  name: string
  folders?: Folder[] = []
  documents?: Document[] = []
  parentFolder?: Folder
  lastModified?: Date

  constructor (id: string, hash: string, name: string, lastModified: Date, parentFolder?: Folder, folders?: Folder[], documents?: Document[]) {
    this.id = id
    this.hash = hash
    this.name = name
    this.lastModified = lastModified
    this.parentFolder = parentFolder
    this.folders = folders
    this.documents = documents
  }

  get root (): boolean {
    return !this.parentFolder
  }
}
