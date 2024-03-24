import DeviceToken from '../../src/authentication/DeviceToken'

describe('DeviceToken', () => {
  it('given a valid token, returns token with device information', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = new DeviceToken(process.env.SAMPLE_PAIR_TOKEN)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(token.token).toBe(process.env.SAMPLE_PAIR_TOKEN)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(token.deviceId).toBe(process.env.SAMPLE_UUID)
    expect(token.deviceDescription).toBe('browser-chrome')
    expect(token.issuer).toBe('rM WebApp')
    expect(token.subject).toBe('rM Device Token')
  })
})
