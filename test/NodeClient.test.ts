/**
 * @jest-environment node
 */
// @ts-nocheck
import https from 'https'
import { NodeClient } from '../src/NodeClient'
import { setupHttpRecording } from './helpers/pollyHelpers'

describe('NodeClient', () => {
  // Enables Polly.js to record and replay HTTP requests for each test
  setupHttpRecording()

  describe ('.get', () => {
    it ('performs GET request', async () => {
      const response = await NodeClient.get('jsonplaceholder.typicode.com', '/todos/1')

      expect(response.ok).toBeTruthy()
    })
  })

  describe ('.post', () => {
    it ('performs POST request', async () => {
      const body = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }

      const response = await NodeClient.post(
        'jsonplaceholder.typicode.com',
        '/posts',
        {},
        body
      )

      expect(response.status).toBe(201)
    })
  })

  describe ('.patch', () => {
    it ('performs PATCH request', async () => {
      const body = { title: 'foo' }

      const response = await NodeClient.patch(
        'jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })
  })

  describe ('.put', () => {
    it ('performs PUT request', async () => {
      const body = {
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1
      }

      const response = await NodeClient.put(
        'jsonplaceholder.typicode.com',
        '/posts/1',
        {},
        body
      )

      expect(response.status).toBe(200)
    })
  })

  describe ('.delete', () => {
    it('performs DELETE request', async () => {
      const response = await NodeClient.delete(
        'jsonplaceholder.typicode.com',
        '/todos/1'
      )

      expect(response.ok).toBeTruthy()
    })
  })
})
