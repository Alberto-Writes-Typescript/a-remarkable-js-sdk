/**
 * @jest-environment node
 */
// @ts-nocheck
import { Device } from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'

const SAMPLE_UUID = '5a6a4cbe-34d6-4f76-a91f-52dc68393f30'
const SAMPLE_ONE_TIME_CODE = 'ndpwgxox'

describe ('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.pair', () => {
    it (
      'given valid one-time code and device information, returns new Device instance with pair token',
      async () => {
        const device = await Device.pair(SAMPLE_UUID, 'browser-chrome', SAMPLE_ONE_TIME_CODE)

        expect(device.id).toBe(SAMPLE_UUID)
        expect(device.description).toBe('browser-chrome')
        expect(device.pairToken.deviceId).toBe(SAMPLE_UUID)
        expect(device.pairToken.deviceDescription).toBe('browser-chrome')
      }, 8000)
  })
})
