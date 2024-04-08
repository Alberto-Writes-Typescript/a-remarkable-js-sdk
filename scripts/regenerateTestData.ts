// @ts-expect-error - Expected error
import path from 'path'
import { execSync } from 'child_process'
import * as fs from 'fs'
import fsExtra from 'fs-extra'
import minimist from 'minimist'
import open from 'open'
import { v4 as uuidv4 } from 'uuid'
import { HashUrl, ServiceManager, Device, FileSystem, type Session } from '../src'
import { spinner, intro, outro, text, confirm, cancel } from '@clack/prompts'

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
  public parameters: {
    deviceId: string
    deviceToken: string
    sessionToken: string
    rootFolderHash: string
    sampleDocumentId: string
    sampleFolderId: string
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

    this.parameters = JSON.parse(Buffer.from(rawUnitTestData[1], 'base64').toString('utf8'))
  }

  setParameter (key: string, value: string | number): void {
    this.parameters[key] = value
  }

  saveEnvironmentConfiguration (): void {
    let fileContents = fs.readFileSync('.env.test', 'utf8')
    const encodedParameters = Buffer.from(JSON.stringify(this.parameters)).toString('base64')
    fileContents = fileContents.replace(/(UNIT_TEST_DATA\s*=\s*).*/, `$1${encodedParameters}`)
    fs.writeFileSync('.env.test', fileContents)
  }
}

/**
 * Removes sensible data from generated HTTP records
 */
function anonymizeHttpRecords (): void {
  function getHarFilePaths (folder: string = HTTP_RECORDS_PATH): string[] {
    let harFiles = []

    const folderEntries = fs.readdirSync(folder, { withFileTypes: true })

    for (const entry of folderEntries) {
      const entryPath = path.join(folder, entry.name)

      if (entry.isDirectory()) {
        harFiles = harFiles.concat(getHarFilePaths(entryPath))
      } else {
        if (path.extname(entry.name) === '.har') harFiles.push(entryPath)
      }
    }

    return harFiles
  }

  const sensibleFieldRegexs = [
    /(\\"visibleName\\":\\")(.*?)\\"/g,
    /(\\"docId\\":\\")(.*?)\\"/g
  ]

  function anonymizeHarFile (harFilePath: string): void {
    let anonymizedData = fs.readFileSync(harFilePath, 'utf8')

    sensibleFieldRegexs.forEach((regex) => { anonymizedData = anonymizedData.replace(regex, '$1-\\"') })

    fs.writeFileSync(harFilePath, anonymizedData, 'utf8')
  }

  (getHarFilePaths()).forEach((harFilePath) => { anonymizeHarFile(harFilePath) })
}

/**
 * SCRIPT BODY
 */
void (async () => {
  const environmentManager = new EnvironmentManager()
  const scriptArguments = new ScriptArguments()

  intro('Regenerate test data for unit tests')

  let device = null
  if (scriptArguments.deviceToken != null) {
    device = new Device(scriptArguments.deviceToken)
  } else {
    const hasToken = await confirm({ message: 'Do you have a new reMarkable one-time code at hand?' })

    if (!hasToken) await open('https://my.remarkable.com/device/remarkable')
    const oneTimeCode = await text({
      message: 'Paste your one-time code (can be requested under \'+ Pair Device\' in the opened website). It will be used to generate a new device token:',
      placeholder: 'zbmtjqqu',
      validate: (value) => {
        if (!value.match(/^[a-z]{8}$/)) return 'Invalid one-time code. one-time code must be 8 characters long and contain only lowercase letters.'
      }
    }) as string

    const s = spinner()
    s.start('Fetching reMarkable API Device Token')
    device = await Device.pair(uuidv4(), 'browser-chrome', oneTimeCode)
    s.stop('Device token received!')
  }

  environmentManager.setParameter('deviceId', device.id as string)
  environmentManager.setParameter('deviceToken', device.token as string)

  const s = spinner()
  s.start('Fetching reMarkable API Session Token')
  const session = await device.connect()
  s.stop('Device token received!')

  environmentManager.setParameter('sessionToken', session.token as string)

  const serviceManager = new ServiceManager(session as Session)

  s.start('Fetching File Tree')
  const fileSystem = await FileSystem.initialize(serviceManager)
  s.stop('File Tree received!')

  environmentManager.setParameter('fileSystemDocumentsCount', fileSystem.documents.length)

  s.start('Fetching Root folder Hash')
  const rootHashUrl = await HashUrl.fromHash('root', serviceManager)
  const rootHash = await (await rootHashUrl.fetch()).text()
  s.stop('Root folder hash received!')

  environmentManager.setParameter('rootFolderHash', rootHash)

  s.start('Fetching sample document')
  const sampleDocument = fileSystem.documents[0]
  s.stop('Sample document received!')

  s.start('Fetching sample folder')
  const sampleFolder = fileSystem.folders[0]
  s.stop('Sample folder received!')

  environmentManager.setParameter('sampleDocumentId', sampleDocument.id)
  environmentManager.setParameter('sampleFolderId', sampleFolder.id)

  const recreateConfirmation = await confirm({
    message: `
      The following parameters will be saved in your environment configuration:

      - Device ID: ${environmentManager.parameters.deviceId}
      - Device Token: ${environmentManager.parameters.deviceToken}
      - Session Token: ${environmentManager.parameters.sessionToken}
      - Root Folder Hash: ${environmentManager.parameters.rootFolderHash}
      - Sample Document ID: ${environmentManager.parameters.sampleDocumentId}
      - Sample Folder ID: ${environmentManager.parameters.sampleFolderId}
      - File System Documents Count: ${environmentManager.parameters.fileSystemDocumentsCount}

      Do you want to replace the existing environment configuration with this one, and
      re-generate test data with these parameters?
    `
  })

  if (!recreateConfirmation) {
    cancel('Operation cancelled...')
    process.exit(0)
  }

  environmentManager.saveEnvironmentConfiguration()

  s.start('Removing HTTP records')
  fsExtra.removeSync(HTTP_RECORDS_PATH)
  s.stop('HTTP records removed!')

  s.start('Running unit tests with new test environment parameters. Http records will be regenerated.')
  // Run test suite to generate new HTTP records (without buffer tests to avoid changing the file system in the process)
  execSync('yarn test:unit:without-file-buffer --silent')
  // Run buffer tests to generate missing HTTP records related to file upload
  execSync('yarn test:unit:file-buffer --silent')
  s.stop('All test passed! New http records generated.')

  s.start('Anonymizing http records')
  anonymizeHttpRecords()
  s.stop('Http records anonymized!')

  await open('https://my.remarkable.com/device/browser')

  const tokenRemovalConfirmation = await confirm({
    message: `
      Test data successfully re-generated. Now make sure to remove the device
      token previously generated/provided from your account, so it cannot be
      used by unauthorized users.

      This token will be present in the http records, meaning that there is
      a potential risk of being leaked and used by unauthorized users.

      Did you already remove the token?
    `
  })

  if (!tokenRemovalConfirmation) {
    cancel('Please remember to remove the token from your account. Exiting...')
    process.exit(0)
  }

  outro('Test data for unit tests regenerated successfully! Your HTTP records and test environment variables have been updated')
})()
