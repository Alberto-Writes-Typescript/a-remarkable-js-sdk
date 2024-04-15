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
      const client = new RemarkableClient(
        global.unitTestParams.deviceToken as string)

      expect(client.session).not.toBeDefined()

      await client.connect()

      expect(client.session.deviceId).toBe(global.unitTestParams.deviceId)
    })

    it('if client has expired session, creates session', async () => {
      const client = new RemarkableClient(
        global.unitTestParams.deviceToken as string,
        global.unitTestParams.sessionToken as string
      )

      const spy = disableSessionExpiration(true)

      const expiredSession = client.session

      try {
        await client.connect()

        expect(client.session).not.toBe(expiredSession)
      } finally {
        enableSessionExpiration(spy)
      }
    })

    it('if client has valid session, does not create session', async () => {
      const client = new RemarkableClient(
        global.unitTestParams.deviceToken as string,
        global.unitTestParams.sessionToken as string
      )

      const spy = disableSessionExpiration(false)

      const currentSession = client.session

      try {
        await client.connect()

        expect(client.session).toBe(currentSession)
      } finally {
        enableSessionExpiration(spy)
      }
    })
  })

  describe('.document', () => {
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

    it('if valid document ID is provided, returns document', async () => {
      const document = await client.document(global.unitTestParams.sampleDocumentId as string)

      expect(document.id).toBe(global.unitTestParams.sampleDocumentId)
    })

    it('if invalid document ID is provided, returns no document', async () => {
      const document = await client.document('invalid document ID')

      expect(document).not.toBeDefined()
    })
  })

  describe('.folder', () => {
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

    it('if valid folder ID is provided, returns folder', async () => {
      const folder = await client.folder(global.unitTestParams.sampleFolderId as string)

      expect(folder.id).toBe(global.unitTestParams.sampleFolderId)
    })

    it('if invalid folder ID is provided, returns no folder', async () => {
      const folder = await client.folder('invalid folder ID')

      expect(folder).not.toBeDefined()
    })
  })

  describe('.sessionExpired', () => {
    let client: RemarkableClient = null

    let spy: jest.SpyInstance

    beforeEach(() => {
      client = new RemarkableClient(
        global.unitTestParams.deviceToken as string,
        global.unitTestParams.sessionToken as string
      )

      spy = disableSessionExpiration(false)
    })

    it('if client has no session, returns true', () => {
      spy = jest.spyOn(client, 'session', 'get').mockReturnValue(undefined)

      expect(client.sessionExpired).toBe(true)

      spy.mockRestore()
    })

    it('if client has expired session, returns true', () => {
      spy = disableSessionExpiration(true)

      try {
        expect(client.sessionExpired).toBe(true)
      } finally {
        spy.mockRestore()
      }
    })

    it('if client has non-expired session, returns false', () => {
      spy = disableSessionExpiration(false)

      try {
        expect(client.sessionExpired).toBe(false)
      } finally {
        spy.mockRestore()
      }
    })
  })
})
