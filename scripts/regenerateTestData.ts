import { consola } from 'consola'
import { execSync } from 'child_process'
import * as fs from 'fs'
import fsExtra from 'fs-extra'
import minimist from 'minimist'
import open from 'open'
import { v4 as uuidv4 } from 'uuid'
import { HashUrl, ServiceManager, Device, FileSystem } from '../src'

/**
 * Defines the list of arguments processed by the script. Each argument is represented
 * by a class attribute, and maps to the corresponding script parameter by its name:
 *
 * @example
 * ```shell
 *  node scripts/regenerateTestData.js -oneTimeCode <code>
 * ```
 *
 * @param {string} oneTimeCode - One-time code required to fetch reMarkable API token.
 * @param {string} deviceToken - reMarkable API Device token.
 */
class ScriptArguments {
  oneTimeCode?: string
  deviceToken?: string

  constructor () {
    // extract script parameters
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const argv = minimist(process.argv.slice(2), {
      alias: {
        oneTimeCode: ['c'],
        deviceToken: ['d']
      }
    })

    this.oneTimeCode = argv.oneTimeCode
    this.deviceToken = argv.deviceToken
  }
}

const ENVIRONMENT_CONFIGURATION_FILE = '.env.test'
const HTTP_RECORDS_PATH = 'test/fixtures/http-records'
const UNIT_TEST_DATA_KEY = 'UNIT_TEST_DATA'

/**
 * Handles test environment variables
 */
class EnvironmentManager {
  public unitTestData: {
    deviceId: string
    deviceToken: string
    sessionToken: string
    rootFolderHash: string
    fileSystemDocumentsCount: number
  }

  constructor () {
    const rawUnitTestData = fs.readFileSync(ENVIRONMENT_CONFIGURATION_FILE, 'utf8')
      // Read each file line
      .split('\n')
      // Return [variable key, variable value] pairs from configuration file
      .map(line => line.split('=').map(variable => variable.trim()))
      // Find pair containing unit test data
      .find(variable => variable[0] === UNIT_TEST_DATA_KEY)

    if (rawUnitTestData == null) throw new Error('Unit test data not found in environment configuration file')

    this.unitTestData = JSON.parse(rawUnitTestData[1])
  }

  setParameter (key: string, value: string | number): void {
    this.unitTestData[key] = value
  }

  saveEnvironmentConfiguration (): void {
    let fileContents = fs.readFileSync('.env.test', 'utf8')
    fileContents = fileContents.replace(/(UNIT_TEST_DATA\s*=\s*).*/, `$1${JSON.stringify(this.unitTestData)}`)
    fs.writeFileSync('.env.test', fileContents)
  }
}

/**
 * SCRIPT BODY
 */
void (async () => {
  const environmentManager = new EnvironmentManager()
  const scriptArguments = new ScriptArguments()

  consola.box('Unit Test Data Regeneration Script')
  consola.info('Regenerates test data for unit tests: environment credentials & HTTP records')

  consola.start('I. Fetching reMarkable API Device Token')
  let deviceToken = scriptArguments.deviceToken
  if (deviceToken != null) {
    environmentManager.setParameter('deviceToken', deviceToken)
    consola.success('Device token found in script arguments!')
  } else {
    await open('https://my.remarkable.com/device/remarkable')
    const oneTimeCode = await consola.prompt('Request new one-time code to reMarkable Cloud (fetch in the TABLET -> + Pair device option) and paste it here: ', { type: 'text' })
    const device = await Device.pair(uuidv4(), 'browser-chrome', oneTimeCode)
    deviceToken = device.token
    environmentManager.setParameter('deviceToken', deviceToken)
    consola.success('Device token received!')
  }

  consola.start('II. Fetching reMarkable API Session Token')
  const device = new Device(environmentManager.unitTestData.deviceToken)
  const session = await device.connect()
  consola.success('Session token received!')

  consola.start('III. Fetching reMarkable File System information')
  const serviceManager = new ServiceManager(session)
  const fileSystem = await FileSystem.initialize(serviceManager)
  const rootHashUrl = await HashUrl.fromHash('root', serviceManager)
  const rootHash = await (await rootHashUrl.fetch()).text()
  consola.success('File System information received!')

  consola.start('III. Updating environment configuration with device & session information')
  environmentManager.setParameter('deviceId', device.id)
  environmentManager.setParameter('deviceToken', device.token)
  environmentManager.setParameter('sessionToken', session.token)
  environmentManager.setParameter('rootFolderHash', rootHash)
  environmentManager.setParameter('fileSystemDocumentsCount', fileSystem.documents.length)
  environmentManager.saveEnvironmentConfiguration()
  consola.success(`Environment configuration updated. These are the new values:
    - Device ID: ${environmentManager.unitTestData.deviceId}
    
    - Device Token: ${environmentManager.unitTestData.deviceToken}
    
    - Session Token: ${environmentManager.unitTestData.sessionToken}
    
    - Root Folder Hash: ${environmentManager.unitTestData.rootFolderHash}
    
    - File System Documents Count: ${environmentManager.unitTestData.fileSystemDocumentsCount}
  `)

  consola.start('IV. Regenerate HTTP records')
  consola.warn(`Current HTTP records under ${HTTP_RECORDS_PATH} will be removed and re-generated`)
  const confirmation = await consola.prompt('Do you want to continue?', { type: 'confirm' })
  if (!confirmation) consola.error(new Error('HTTP record data re-generation cancelled. Exiting...'))

  // Remove all HTTP records
  fsExtra.removeSync(HTTP_RECORDS_PATH)
  // Run test suite to generate new HTTP records (without buffer tests to avoid changing the file system in the process)
  execSync('yarn test:unit:without-file-buffer')
  // Run buffer tests to generate missing HTTP records related to file upload
  execSync('yarn test:unit:file-buffer')

  consola.success('HTTP records regenerated!')

  consola.start('V. Remove reMarkable API Device Token')
  consola.warn('Remove the generated token from your reMarkable account, so it cannot be used by unauthorized users.')
  await open('https://my.remarkable.com/device/browser')
  await consola.prompt('Select yes once token is disabled', { type: 'confirm' })

  consola.success('All done! You can now run the test suite to verify the changes.')
})()
