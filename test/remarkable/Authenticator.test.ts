import { setupHttpRecording } from '../helpers/pollyHelpers'
import { Authenticator } from '../../src/remarkable/Authenticator'

const ONE_TIME_CODE: string = 'ddagnfga'
const DEVICE_UUID: string = '967116ac-09ee-477b-8b3c-4044acde1d97'

describe('Authenticator', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe('.pairDevice', () => {
    it('if valid UUID & One Time Code, returns Authenticator with token', async () => {
      const authenticator = await Authenticator.pairDevice(DEVICE_UUID, ONE_TIME_CODE)
    }, 30000)
  })
})
