import nock from 'nock'

import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'
import TokenStore from './tokenStore/redisTokenStore'

jest.mock('./tokenStore/redisTokenStore')

const tokenStore = new TokenStore(null) as jest.Mocked<TokenStore>

const username = 'Bob'
const token = { access_token: 'token-1', expires_in: 300 }

describe('hmppsAuthClient', () => {
  let fakeHmppsAuthApi: nock.Scope
  let hmppsAuthClient: HmppsAuthClient
  let basePath: string

  beforeEach(() => {
    // Be tolerant: the configured URL may include a path (e.g. .../auth) or be a bare origin.
    basePath = ''
    try {
      const { origin, pathname } = new URL(String(config.apis.hmppsAuth.url))
      basePath = pathname.replace(/\/$/, '')
      fakeHmppsAuthApi = nock(origin)
    } catch {
      // If it's not a fully-qualified URL, fall back to prior behavior
      fakeHmppsAuthApi = nock(String(config.apis.hmppsAuth.url))
    }
    hmppsAuthClient = new HmppsAuthClient(tokenStore)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  // helper to log pending mocks if a scope didn't match
  const ensureDone = (scope: nock.Scope) => {
    const done = scope.isDone()
    if (!done) {
      // eslint-disable-next-line no-console
      console.log('Pending nocks:', nock.pendingMocks())
    }
    expect(done).toBe(true)
  }

  // Body matchers that accept either a url-encoded string or an object
  type BodyObject = Record<string, unknown>
  const hasGrantType = (body: unknown): boolean =>
    (typeof body === 'string' && /(^|&)grant_type=client_credentials(&|$)/.test(body)) ||
    (typeof body === 'object' && body !== null && (body as BodyObject).grant_type === 'client_credentials')

  const hasUsernameBob = (body: unknown): boolean =>
    (typeof body === 'string' && /(^|&)username=Bob(&|$)/.test(body)) ||
    (typeof body === 'object' && body !== null && (body as BodyObject).username === 'Bob')

  describe('getSystemClientToken', () => {
    it('should instantiate the redis client', async () => {
      tokenStore.getToken.mockResolvedValue(token.access_token)
      await hmppsAuthClient.getSystemClientToken(username)
    })

    it('should return token from redis if one exists', async () => {
      tokenStore.getToken.mockResolvedValue(token.access_token)
      const output = await hmppsAuthClient.getSystemClientToken(username)
      expect(output).toEqual(token.access_token)
    })

    it('should return token from HMPPS Auth with username', async () => {
      tokenStore.getToken.mockResolvedValue(null)

      const scope = fakeHmppsAuthApi
        .post(`${basePath}/oauth/token`, body => hasGrantType(body) && hasUsernameBob(body))
        .basicAuth({
          user: config.apis.hmppsAuth.systemClientId,
          pass: config.apis.hmppsAuth.systemClientSecret,
        })
        // Do NOT match Content-Type to avoid charset/ts client differences
        .reply(200, token, { 'Content-Type': 'application/json' })

      const output = await hmppsAuthClient.getSystemClientToken(username)

      expect(output).toEqual(token.access_token)
      expect(tokenStore.setToken).toHaveBeenCalledWith('Bob', token.access_token, 240)
      ensureDone(scope)
    })

    it('should return token from HMPPS Auth without username', async () => {
      tokenStore.getToken.mockResolvedValue(null)

      const scope = fakeHmppsAuthApi
        .post(`${basePath}/oauth/token`, body => hasGrantType(body))
        .basicAuth({
          user: config.apis.hmppsAuth.systemClientId,
          pass: config.apis.hmppsAuth.systemClientSecret,
        })
        // Do NOT match Content-Type to avoid charset/ts client differences
        .reply(200, token, { 'Content-Type': 'application/json' })

      const output = await hmppsAuthClient.getSystemClientToken()

      expect(output).toEqual(token.access_token)
      expect(tokenStore.setToken).toHaveBeenCalledWith('%ANONYMOUS%', token.access_token, 240)
      ensureDone(scope)
    })
  })
})
