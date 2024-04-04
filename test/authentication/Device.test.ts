import { InvalidTokenError } from 'jwt-decode'
import Device from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import { InvalidRemarkableTokenError } from '../../src/authentication/RemarkableTokenPayload'
import Session from '../../src/authentication/Session'

describe('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('constructor', () => {
    it('given valid device token, initializes Device instance', () => {
      const device = new Device(global.unitTestParams.deviceToken as string)

      expect(device.id).toBe(global.unitTestParams.deviceId)
      expect(device.description).toBe('browser-chrome')
    })

    it('given invalid token, throws error', () => {
      // eslint-disable-next-line no-new
      expect(() => { new Device('token') }).toThrowError(InvalidTokenError)
    })

    it('given invalid reMarkable token, throws error', () => {
      const tokenWithInvalidPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      // eslint-disable-next-line no-new
      expect(() => { new Device(tokenWithInvalidPayload) }).toThrow(InvalidRemarkableTokenError)
    })
  })

  describe('.connect', () => {
    it(
      'given valid pair token, updates Device with new session token',
      async () => {
        const device = new Device(global.unitTestParams.deviceToken as string)

        const session = await device.connect()

        expect(session).toBeInstanceOf(Session)

        expect(session.deviceId).toBe(global.unitTestParams.deviceId)
      },
      30000
    )
  })
})
