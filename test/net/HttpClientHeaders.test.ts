import HttpClientHeaders from '../../src/net/HttpClientHeaders'

describe('HttpClientHeaders', () => {
  let headers = null

  beforeEach(() => {
    headers = new HttpClientHeaders({ Authentication: 'Bearer token' })
  })

  describe('constructor', () => {
    it('parses given Object key-value pairs into HTTP headers', () => {
      expect(headers.entries).toEqual([{ key: 'Authentication', value: 'Bearer token' }])
    })
  })

  describe('entry', () => {
    it('returns header with given key', () => {
      expect(headers.entry('Authentication'))
        .toEqual({ key: 'Authentication', value: 'Bearer token' })
    })
  })

  describe('merge', () => {
    it('adds new headers to existing headers', () => {
      headers.merge(new HttpClientHeaders({ 'Content-Type': 'application/json' }))

      expect(headers.entries).toEqual([
        { key: 'Authentication', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' }
      ])
    })

    it('overwrites existing headers with new headers values', () => {
      headers.merge(new HttpClientHeaders({ Authentication: 'Bearer new-token' }))

      expect(headers.entries).toEqual([{ key: 'Authentication', value: 'Bearer new-token' }])
    })
  })
})
