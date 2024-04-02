import { InvalidTokenError } from 'jwt-decode'
import Device from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import RemarkableTokenPayload, { InvalidRemarkableTokenError } from '../../src/authentication/RemarkableTokenPayload'
import Session from '../../src/authentication/Session'

describe('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('#pair', () => {
    // TODO: This is the only request which does not work with Polly.js, skip recording in future PR
    it(
      'given valid one-time code and device information, returns new Device instance with pair token',
      async () => {
        /*
          const device = await Device.pair(SAMPLE_UUID, 'browser-chrome', SAMPLE_ONE_TIME_CODE)
          expect(device.id).toBe(SAMPLE_UUID)
          expect(device.description).toBe('browser-chrome')
          expect(device.pairToken.deviceId).toBe(SAMPLE_UUID)
          expect(device.pairToken.deviceDescription).toBe('browser-chrome')
         */
      },
      30000
    )
  })

  describe('constructor', () => {
    it('given valid device token, initializes Device instance', () => {
      const device = new Device(process.env.SAMPLE_PAIR_TOKEN)

      expect(device.id).toBe(process.env.SAMPLE_UUID)
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
        const device = new Device(process.env.SAMPLE_PAIR_TOKEN)

        await device.connect()

        expect(device.session).toBeInstanceOf(Session)

        const sessionTokenPayload = new RemarkableTokenPayload(device.session.token)
        expect(sessionTokenPayload.deviceId).toBe(process.env.SAMPLE_UUID)
        expect(sessionTokenPayload.deviceDescription).toBe('browser-chrome')
      },
      30000
    )
  })
})
