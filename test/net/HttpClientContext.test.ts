import HttpClientContext from '../../src/net/HttpClientContext'

describe('HttpClientContext', () => {
  const context = new HttpClientContext('https://example.com', { Authentication: 'Bearer token' })

  describe('merge', () => {
    it('if given context has host, returns given context host', () => {
      const otherContext = new HttpClientContext('https://other.com')

      const mergedContext = context.merge(otherContext)

      expect(mergedContext.host).toBe(otherContext.host)
    })

    it('if given context has no host, returns original context host', () => {
      const otherContext = new HttpClientContext()

      const mergedContext = context.merge(otherContext)

      expect(mergedContext.host).toBe(context.host)
    })

    it('if given context has headers, returns context with given context headers', () => {
      const otherContext = new HttpClientContext(null, { 'Content-Type': 'application/json' })

      const mergedContext = context.merge(otherContext)
      const expectedContextHeaders = {
        Authentication: 'Bearer token',
        'Content-Type': 'application/json'
      }

      expect(mergedContext.headers).toEqual(expectedContextHeaders)
    })

    it('if given context headers has header/s present in original context,' +
             'returns context with common headers overwritten by given context', () => {
      const otherContext = new HttpClientContext(null, { Authentication: 'Bearer new' })

      const mergedContext = context.merge(otherContext)
      const expectedContextHeaders = { Authentication: 'Bearer new' }

      expect(mergedContext.headers).toEqual(expectedContextHeaders)
    })
  })
})
