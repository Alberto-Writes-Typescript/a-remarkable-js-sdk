import { Polly, type PollyConfig } from '@pollyjs/core'

const DEFAULT_RECORDS_DIR: string = './test/fixtures/http-records'
const DEFAULT_POLLY_CONFIGURATION: PollyConfig = {
  adapters: ['node-http'],
  persister: 'fs'
}

export function startHttpRecording (): Polly {
  const recordName = `${DEFAULT_RECORDS_DIR}/${expect.getState().currentTestName}`

  const configuration = Object.assign(
    DEFAULT_POLLY_CONFIGURATION,
    { persisterOptions: { fs: { recordingsDir: recordName } } }
  )

  return new Polly('recordings', configuration)
}

export async function stopHttpRecording (polly: Polly): Promise<void> {
  await polly.stop()
}

export function setupHttpRecording (): void {
  let polly: Polly

  beforeEach(() => { polly = startHttpRecording() })
  afterEach(async () => { await stopHttpRecording(polly) })
}
