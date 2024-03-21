import HashUrl from './HashUrl'
import ServiceManager from '../ServiceManager'

class EntryPayload {
  hash: string
  type: string
  documentId: string
  subfiles: number
  size: bigint

  constructor (serializedEntry: string) {
    const [hash, type, documentId, subfiles, size] = serializedEntry.split(':')

    this.hash = hash
    this.type = type
    this.documentId = documentId

    if (subfiles !== undefined) this.subfiles = parseInt(subfiles)
    if (size !== undefined) this.size = BigInt(size)
  }
}

export default class Entry {
  static async initialize (serializedEntry: string | null, serviceManager: ServiceManager): Promise<RootEntry | CollectionEntry> {
    // If no serialized entry is provided, it will fetch root folder entry (which has no serialized payload)
    if (serializedEntry === null || serializedEntry === undefined) {
      return await RootEntry.initialize(serviceManager)
    }

    const entryPayload = new EntryPayload(serializedEntry)

    const suffixRegex = /\.[a-z0-9]+$/i

    // If entry's document ID is suffixed, seek matching Entry type
    if (suffixRegex.test(entryPayload.documentId)) {
    } else {
      // If entry's document ID has no suffix, it is a collection entry
      return await CollectionEntry.initialize(entryPayload, serviceManager)
    }
  }

  hash: string
  id: string
  content: any
  serviceManager: ServiceManager

  constructor (hash: string, id: string, serviceManager: ServiceManager) {
    this.hash = hash
    this.id = id
    this.serviceManager = serviceManager
  }

  async initialize (): Promise<Entry> {
    const hashUrl = await HashUrl.fromHash(this.hash, this.serviceManager)
    this.content = await hashUrl.fetchContent()
    return this
  }
}

export class RootEntry {
  static async initialize (serviceManager: ServiceManager): Promise<RootEntry> {
    const hashUrl = await HashUrl.fromRootHash(serviceManager)
    const serializedRootEntry = await hashUrl.fetchContent()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [schemaVersion, ...serializedEntries] = serializedRootEntry.slice(0, -1).split('\n')

    const entries = await Promise.all(
      serializedEntries.map(
        async (serializedEntry) => await Entry.initialize(serializedEntry, serviceManager)
      )
    )

    return new RootEntry(hashUrl.relativePath, parseInt(schemaVersion), entries)
  }

  entries: Array<RootEntry | CollectionEntry>
  hash: string
  schemaVersion: number

  constructor (
    hash: string,
    schemaVersion: number,
    entries: Array<RootEntry | CollectionEntry>
  ) {
    this.hash = hash
    this.schemaVersion = schemaVersion
    this.entries = entries
  }
}

export class CollectionEntry {
  static async initialize (entryPayload: EntryPayload, serviceManager: ServiceManager): Promise<CollectionEntry> {
    const hashUrl = await HashUrl.fromHash(entryPayload.hash, serviceManager)
    const serializedCollectionEntry = await hashUrl.fetchContent()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [schemaVersion, ...serializedEntries] = serializedCollectionEntry.slice(0, -1).split('\n')

    const entries = await Promise.all(
      serializedEntries.map(
        async (serializedEntry) => await Entry.initialize(serializedEntry, serviceManager)
      )
    )

    return new CollectionEntry(entryPayload, parseInt(schemaVersion), entries)
  }

  documentId: string
  hash: string
  entries: Array<RootEntry | CollectionEntry>
  schemaVersion: number
  size: bigint
  subfiles: number
  type: string

  constructor (
    entryPayload: EntryPayload,
    schemaVersion: number,
    entries: Array<RootEntry | CollectionEntry>
  ) {
    this.documentId = entryPayload.documentId
    this.hash = entryPayload.hash
    this.entries = entries
    this.schemaVersion = schemaVersion
    this.size = entryPayload.size
    this.subfiles = entryPayload.subfiles
    this.type = entryPayload.type
  }
}

export class PdfCollectionEntry extends CollectionEntry {
}

export class ePubCollectionEntry extends CollectionEntry {
}
