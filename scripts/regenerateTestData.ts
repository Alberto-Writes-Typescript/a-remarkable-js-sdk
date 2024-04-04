import Device from '../src/authentication/Device'
import * as fs from 'fs'
import fsExtra from 'fs-extra'
import open from 'open'
import { v4 as uuidv4 } from 'uuid'
import readlineSync from 'readline-sync'
import minimist from 'minimist'

const log = console.log

const ENVIRONMENT_CONFIGURATION_FILE = '.env.test'
const HTTP_RECORDS_PATH = 'test/fixtures/http-records'

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
 * @param {string} token - reMarkable API Device token.
 * @param {string} uuid - reMarkable API Device ID associated to given `token`.
 */
class ScriptArguments {
  oneTimeCode?: string
  token?: string
  uuid?: string

  constructor () {
    // extract script parameters
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const argv = minimist(process.argv.slice(2))

    this.oneTimeCode = argv.oneTimeCode
    this.token = argv.token
    this.uuid = argv.uuid
  }
}

/**
 * Logic to pair new device to the reMarkable Cloud API. Used to fetch new device tokens.
 */
class DeviceConnector {
  static async fromScriptArguments (scriptArguments: ScriptArguments): Promise<DeviceConnector> {
    const generator = new DeviceConnector(scriptArguments.token, scriptArguments.uuid)

    if (generator.pairRequired() && scriptArguments.oneTimeCode != null) {
      await generator.pair(scriptArguments.oneTimeCode)
    } else {
      return generator
    }
  }

  device?: Device
  oneTimeCode?: string

  constructor (token?: string, uuid?: string) {
    if (uuid != null && token != null) {
      this.device = new Device(token)
    }
  }

  pairRequired (): boolean {
    return this.device == null
  }

  async pair (oneTimeCode: string): Promise<Device> {
    this.device = await Device.pair(uuidv4(), 'browser-chrome', oneTimeCode)
    this.oneTimeCode = oneTimeCode

    return this.device
  }
}

/**
 * Logic to update ``.env.test` file credentials
 */
class EnvironmentConfigurationManager {
  configurationParameters: EnvironmentConfigurationParameter[]

  constructor () {
    this.configurationParameters = fs.readFileSync('.env.test', 'utf8')
      .split('\n')
      .map(line => EnvironmentConfigurationParameter.fromLine(line))
      .filter(parameter => parameter.name !== '' || parameter.value != null)
  }

  configurationParameter (name: string): EnvironmentConfigurationParameter {
    return this.configurationParameters.find(parameter => parameter.name === name)
  }

  setConfigurationParameter (name: string, value: string): void {
    const configurationParameter = this.configurationParameter(name)

    if (configurationParameter != null) {
      configurationParameter.value = value
    } else {
      this.configurationParameters.push(new EnvironmentConfigurationParameter(name, value))
    }

    this.persistConfigurationParameters()
  }

  private persistConfigurationParameters (): void {
    fs.writeFileSync(ENVIRONMENT_CONFIGURATION_FILE, this.configurationParameters.map(parameter => parameter.toString()).join('\n'))
  }
}

class EnvironmentConfigurationParameter {
  static fromLine (line: string): EnvironmentConfigurationParameter {
    const [name, value] = line.split('=').map(s => s.trim())
    return new EnvironmentConfigurationParameter(name, value)
  }

  name: string
  value: string

  constructor (name: string, value: string) {
    this.name = name
    this.value = value
  }

  toString (): string {
    return `${this.name} = ${this.value}`
  }
}

/**
 * SCRIPT BODY
 */
void (async () => {
  const scriptArguments = new ScriptArguments()
  const deviceConnector = await DeviceConnector.fromScriptArguments(scriptArguments)

  log('Regenerating test data...')

  log(`
  (!) Take into account all test data and environment variables will be overwritten.
      If the process is interrupted, test environment might be left in an inconsistent state.
  `)

  if (deviceConnector.pairRequired()) {
    log('1. Generating new pair token...')

    let oneTimeCode: string

    while (deviceConnector.pairRequired()) {
      log('   -> Request new one-time code to reMarkable Cloud (fetch in the TABLET -> + Pair device option). Webpage for code retrieval will be opened automatically ...')
      await open('https://my.remarkable.com/device/remarkable')
      oneTimeCode = readlineSync.question('   -> Enter given one-time code: ')
      await deviceConnector.pair(oneTimeCode)
    }
  }

  log(`
  ✅ - Token generated:
     - Device ID: ${deviceConnector.device.id}
     - Device Description: ${deviceConnector.device.description}
     - Pair Token: ${deviceConnector.device.token}
  `)

  log('2. Rewriting test environment variables...')

  const environmentConfigurationManager = new EnvironmentConfigurationManager()
  environmentConfigurationManager.setConfigurationParameter('SAMPLE_ONE_TIME_CODE', deviceConnector.oneTimeCode)
  environmentConfigurationManager.setConfigurationParameter('SAMPLE_UUID', deviceConnector.device.id)
  environmentConfigurationManager.setConfigurationParameter('SAMPLE_PAIR_TOKEN', deviceConnector.device.token)

  log('✅ - Environment Credentials successfully updated in .env.test')

  log('3. Regenerating HTTP records...')

  fsExtra.emptyDirSync(HTTP_RECORDS_PATH)
  log('✅ - Existing HTTP records successfully deleted')

  log('   -> In a new terminal, re-run the project tests and fix any potential issues that might appear.')
  readlineSync.question('      Once all tests pass, come back to this terminal and press any key to continue...')

  log(`
  ℹ️ - Once all tests pass, HTTP records are regenerated.
       Now remove the generated token from your reMarkable account, so it cannot be used by unauthorized users.
       References to the token might be present in the HTTP records, thus token removal is required.
  `)
  await open('https://my.remarkable.com/device/browser')
  readlineSync.question('      Once token is removed from the terminal, come back to this terminal and press any key to continue...')
})()
