/**
 * @jest-environment node
 */
// @ts-nocheck
import Device from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'

const SAMPLE_ONE_TIME_CODE = 'cfdaemci'
const SAMPLE_UUID = '02ce7950-0b1e-4039-95a7-e098e10c33fa'
const SAMPLE_PAIR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoMC11c2VyaWQiOiJhdXRoMHw1ZWZjMjg3ZmM0ODgwMTAwMTM0NGY5MjMiLCJkZXZpY2UtZGVzYyI6ImJyb3dzZXItY2hyb21lIiwiZGV2aWNlLWlkIjoiMDJjZTc5NTAtMGIxZS00MDM5LTk1YTctZTA5OGUxMGMzM2ZhIiwiaWF0IjoxNzA5MDE2NTk3LCJpc3MiOiJyTSBXZWJBcHAiLCJqdGkiOiJjazB0S2FFdFM4MD0iLCJuYmYiOjE3MDkwMTY1OTcsInN1YiI6InJNIERldmljZSBUb2tlbiJ9.vO5iXB-Xy1cbpn8HeZmt5NYyI3wytnPxYp2-2WggFhU'

describe ('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.pair', () => {
    // TODO: This is the only request which does not work with Polly.js, skip recording in future PR
    it (
      'given valid one-time code and device information, returns new Device instance with pair token',
      async () => {
        /*const device = await Device.pair(SAMPLE_UUID, 'browser-chrome', SAMPLE_ONE_TIME_CODE)

        expect(device.id).toBe(SAMPLE_UUID)
        expect(device.description).toBe('browser-chrome')
        expect(device.pairToken.deviceId).toBe(SAMPLE_UUID)
        expect(device.pairToken.deviceDescription).toBe('browser-chrome')*/
      },
      30000
    )
  })

  describe ('.connect', () => {
    it (
      'given valid pair token, updates Device with new session token',
      async () => {
        const device = new Device(SAMPLE_UUID, 'browser-chrome', SAMPLE_PAIR_TOKEN)

        await device.connect()

        expect(device.sessionToken.deviceId).toBe(SAMPLE_UUID)
        expect(device.sessionToken.deviceDescription).toBe('browser-chrome')
      },
      30000
    )
  })
})
