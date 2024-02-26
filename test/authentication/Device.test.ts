/**
 * @jest-environment node
 */
// @ts-nocheck
import { Device } from '../../src/authentication/Device'
import { setupHttpRecording } from '../helpers/pollyHelpers'

const SAMPLE_UUID = '02ce7950-0b1e-4039-95a7-e098e10c33fa'
const SAMPLE_ONE_TIME_CODE = 'fixpurbo'

describe ('Device', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.pair', () => {
    // TODO: figure out problem with Polly.JS not being able to record request. Do I need a custom adapter?
  })

  describe ('.connect', () => {
  })
})
