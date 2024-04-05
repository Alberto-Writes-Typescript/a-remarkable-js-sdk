import { promises as fs } from 'fs'
import RemarkableClient from '../src/RemarkableClient'
import { Session } from '../src/authentication'
import { setupHttpRecording } from './helpers/pollyHelpers'

function disableSessionExpiration (value: boolean): jest.SpyInstance {
  return jest.spyOn(Session.prototype, 'expired', 'get').mockReturnValue(value)
}

function enableSessionExpiration (spy: jest.SpyInstance): void {
  spy.mockRestore()
}

describe('RemarkableClient', () => {
  setupHttpRecording()

  describe('.connect', () => {
    it('if client has no session, creates session', async () => {
      const client = new RemarkableClient(global.unitTestParams.deviceToken as string)

      expect(client.session).not.toBeDefined()

      await client.connect()

      expect(client.session.deviceId).toBe(global.unitTestParams.deviceId)
    })

    it('if client has expired session, creates session', async () => {
      const client = new RemarkableClient(global.unitTestParams.deviceToken as string)

      const spy = disableSessionExpiration(true)

      try {
        expect(client.session).not.toBeDefined()

        const session = new Session(global.unitTestParams.sessionToken as string)

        client.session = session

        await client.connect()

        expect(client.session).not.toBe(session)
      } finally {
        enableSessionExpiration(spy)
      }
    })

    it('if client has valid session, does not create session', async () => {
      const client = new RemarkableClient(global.unitTestParams.deviceToken as string)

      const spy = disableSessionExpiration(false)

      try {
        expect(client.session).not.toBeDefined()

        const session = new Session(global.unitTestParams.sessionToken as string)

        client.session = session

        await client.connect()

        expect(client.session).toBe(session)
      } finally {
        enableSessionExpiration(spy)
      }
    })

    it('updates service manager with new session', async () => {
      const client = new RemarkableClient(global.unitTestParams.deviceToken as string)

      expect(client.session).not.toBeDefined()

      await client.connect()

      expect(client.serviceManager.session).toBe(client.session)
    })
  })

  describe('.fileSystem', () => {
    let client: RemarkableClient = null

    let spy: jest.SpyInstance

    beforeEach(() => {
      client = new RemarkableClient(
        global.unitTestParams.deviceToken as string,
        global.unitTestParams.sessionToken as string
      )

      spy = disableSessionExpiration(false)
    })

    afterEach(() => {
      enableSessionExpiration(spy)
    })

    it('returns file system instance', async () => {
      const fileSystem = await client.fileSystem()

      expect(fileSystem.documents.length).toBeGreaterThan(0)
      expect(fileSystem.folders.length).toBeGreaterThan(0)
    })
  })

  describe('.upload', () => {
    let client: RemarkableClient = null

    let spy: jest.SpyInstance

    beforeEach(() => {
      client = new RemarkableClient(
        global.unitTestParams.deviceToken as string,
        global.unitTestParams.sessionToken as string
      )

      spy = disableSessionExpiration(false)
    })

    afterEach(() => {
      enableSessionExpiration(spy)
    })

    it('if file buffer represents a PDF, uploads file to document storage', async () => {
    }, 100000)

    it('if file buffer represents an ePub, uploads file to document storage', async () => {
    })

    it('if file buffer represents file with incompatible format, throws error', async () => {

    })
  })
})
