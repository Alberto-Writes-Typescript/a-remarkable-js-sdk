import Device from '../../src/authentication/Device'
import DeviceToken from '../../src/authentication/DeviceToken'
import Entry, { RootEntry } from '../../src/internal/Entry'
import ServiceManager from '../../src/ServiceManager'
import { setupHttpRecording } from '../helpers/pollyHelpers'

describe('Entry', () => {
  let serviceManager: ServiceManager = null

  const serializedCollectionEntry = 'fb6597077542383c2537bce943c81a985a2680bbbcd7ff559e78f2da21c63944:80000000:00f9663d-3d4a-4640-a755-3a0e66b44f1d:4:3943357'

  setupHttpRecording()

  beforeEach(async () => {
    const device = new Device(
      process.env.SAMPLE_UUID,
      'browser-chrome',
      new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)
    )

    await device.connect()

    serviceManager = new ServiceManager(device)
  })

  describe('initialize', () => {
    it('if no payload is provided, returns RootEntry', async () => {
      /**
       * Mocks RootEntry initialization to avoid performing too many requests
       * to the reMarkable API when initializing nested collection entries.
       */
      jest
        .spyOn(RootEntry, 'initialize')
        .mockImplementation(async () => new RootEntry('hash', 2, []))

      const entry = await Entry.initialize(null, serviceManager)

      expect(entry.constructor.name).toBe('RootEntry')
    }, 100000)

    it('if collection payload is provided, returns CollectionEntry', async () => {
      const entry = await Entry.initialize(serializedCollectionEntry, serviceManager)

      expect(entry.constructor.name).toBe('CollectionEntry')
    }, 100000)
  })
})
