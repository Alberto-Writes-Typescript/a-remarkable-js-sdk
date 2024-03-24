import Device from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'
import DeviceToken from '../../src/authentication/DeviceToken'

describe('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.pair', () => {
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

  describe('.connect', () => {
    it(
      'given valid pair token, updates Device with new session token',
      async () => {
        const device = new Device(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          process.env.SAMPLE_UUID, 'browser-chrome', new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)
        )

        await device.connect()

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(device.sessionToken.deviceId).toBe(process.env.SAMPLE_UUID)
        expect(device.sessionToken.deviceDescription).toBe('browser-chrome')
      },
      30000
    )
  })
})
