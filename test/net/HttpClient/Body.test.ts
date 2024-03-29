import Body, { InvalidBodyPayloadError } from '../../../src/net/HttpClient/Body'

describe('Body', () => {
  describe('.serialized', () => {
    it('if payload is an Object, returns String representing stringified Object', () => {
      const payload = { foo: 'bar' }

      const requestBody = new Body(payload)

      expect(requestBody.serialized).toBe(JSON.stringify(payload))
    })

    it('if payload is an ArrayBuffer, returns ArrayBuffer', () => {
      const payload = (new TextEncoder().encode('{ foo: "bar" }')).buffer

      const requestBody = new Body(payload)

      expect(requestBody.serialized).toBe(payload)
    })

    it('if payload is a Buffer, returns Buffer', () => {
      const payload = Buffer.from('{ foo: "bar" }')

      const requestBody = new Body(payload)

      expect(requestBody.serialized).toBe(payload)
    })

    it('if payload is a String, returns String', () => {
      const payload = '{ foo: "bar" }'

      const requestBody = new Body(payload)

      expect(requestBody.serialized).toBe(payload)
    })

    it('if payload is unsupported, throws InvalidHttpBodyError', () => {
      const payload = true

      // @ts-expect-error Testing invalid payload
      expect(() => new Body(payload)).toThrow(InvalidBodyPayloadError)
    })
  })
})
