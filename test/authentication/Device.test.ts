import { InvalidTokenError } from 'jwt-decode'
import Device, { InvalidRemarkableTokenError } from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'

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

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(device.sessionToken.deviceId).toBe(process.env.SAMPLE_UUID)
        expect(device.sessionToken.deviceDescription).toBe('browser-chrome')
      },
      30000
    )
  })
})
