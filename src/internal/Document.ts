import type Folder from './Folder'

/**
 * Represents a reMarkable Cloud document
 */
export default class Document {
  id: string
  hash: string
  name: string
  fileType: 'pdf' | 'epub' | 'notebook'
  folder?: Folder
  lastModified: Date
  lastOpened: Date

  constructor (
    id: string,
    hash: string,
    name: string,
    fileType: 'pdf' | 'epub' | 'notebook',
    lastModified?: Date,
    lastOpened?: Date,
    folder?: Folder
  ) {
    this.id = id
    this.hash = hash
    this.name = name
    this.fileType = fileType
    this.lastModified = lastModified
    this.lastOpened = lastOpened
    this.folder = folder
  }
}
