import { Device, type DeviceDescription, Session } from './authentication'
import {
  Document,
  DocumentReference,
  FileNotUploadedError,
  FileBuffer,
  UnsupportedFileExtensionError,
  FileBufferType,
  FileSystem,
  Folder,
  HashUrl
} from './internal'
import HttpClient from './net/HttpClient'
import FetchClient from './net/FetchClient'
import NodeClient from './net/NodeClient'
import ServiceManager from './serviceDiscovery/ServiceManager'
import RemarkableClient from './RemarkableClient'

export {
  Device, type DeviceDescription, Session,
  Document,
  DocumentReference,
  FileNotUploadedError,
  FileBuffer,
  UnsupportedFileExtensionError,
  FileBufferType,
  FileSystem,
  Folder,
  HashUrl,
  HttpClient, NodeClient, FetchClient,
  ServiceManager,
  RemarkableClient
}
