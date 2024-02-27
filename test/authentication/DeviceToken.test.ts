import DeviceToken from '../../src/authentication/DeviceToken'

const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoMC11c2VyaWQiOiJhdXRoMHw1ZWZjMjg3ZmM0ODgwMTAwMTM0NGY5MjMiLCJkZXZpY2UtZGVzYyI6ImJyb3dzZXItY2hyb21lIiwiZGV2aWNlLWlkIjoiZmQwNDNkNGItYWUzNy00NTJlLThkMjAtNmE1MGVkY2M0YmZjIiwiaWF0IjoxNzA4OTM0MDAyLCJpc3MiOiJyTSBXZWJBcHAiLCJqdGkiOiJjazB0dXhrbkhQOD0iLCJuYmYiOjE3MDg5MzQwMDIsInN1YiI6InJNIERldmljZSBUb2tlbiJ9.Tbb557AZHRCO4BFmTKXm1jDNRV9PdjMWTwZPo9eDYzw'

describe('DeviceToken', () => {
  it('given a valid token, returns token with device information', () => {
    const token = new DeviceToken(SAMPLE_TOKEN)

    expect(token.token).toBe(SAMPLE_TOKEN)
    expect(token.deviceId).toBe('fd043d4b-ae37-452e-8d20-6a50edcc4bfc')
    expect(token.deviceDescription).toBe('browser-chrome')
    expect(token.issuer).toBe('rM WebApp')
    expect(token.subject).toBe('rM Device Token')
  })
})
