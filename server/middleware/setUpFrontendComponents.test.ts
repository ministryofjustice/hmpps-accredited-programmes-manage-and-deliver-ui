import express from 'express'
import nock from 'nock'
import request from 'supertest'
import logger from '../../logger'
import config from '../config'
import nunjucksSetup from '../utils/nunjucksSetup'
import setUpFrontendComponents from './setUpFrontendComponents'
import setUpWebSecurity from './setUpWebSecurity'
import frontendComponents from '../../wiremock_mappings/frontendComponents.json'

jest.mock('../../logger')

function createApp(authenticated = true) {
  const app = express()
  nunjucksSetup(app)
  app.use(setUpWebSecurity())
  app.use((_req, res, next) => {
    if (authenticated) {
      res.locals.user = {
        token: 'user-token',
        displayName: 'Test User',
        name: 'Test User',
        username: 'TEST_USER',
        userId: '123',
        userUuid: undefined,
        userRoles: ['PROBATION'],
        authSource: 'delius',
      }
    }
    next()
  })
  app.use(setUpFrontendComponents())
  app.all('/{*path}', (_req, res) => {
    res.json(res.locals.feComponents || {})
  })
  return app
}

describe('setUpFrontendComponents', () => {
  beforeAll(() => {
    if (!nock.isActive()) nock.activate()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  afterAll(() => {
    nock.restore()
  })

  it.each([
    ['get', '/'],
    ['get', '/referral/123'],
    ['post', '/referral/123'],
  ] as const)('fetches components with the user token for %s %s', async (method, url) => {
    const apiUrl = config.apis.probationApi.url
    const api = nock(apiUrl)
      .get('/api/components')
      .query({ component: ['header', 'footer'] })
      .matchHeader('x-user-token', 'user-token')
      .reply(200, {
        header: { html: '<header>PDS header</header>', css: [], javascript: [] },
        footer: {
          html: '<footer><a href="/accessibility/">Accessibility</a><a href="/cookies-policy">Cookies policy</a></footer>',
          css: [`${apiUrl}/assets/css/footer.css`],
          javascript: [],
        },
      })

    const response = await request(createApp())[method](url).expect(200)

    expect(api.isDone()).toBe(true)
    expect(response.body.footer).toBe(
      '<footer><a href="/accessibility/accredited-programmes">Accessibility</a><a href="/cookies-policy">Cookies policy</a></footer>',
    )
    expect(response.body.cssIncludes).toEqual([`${apiUrl}/assets/css/footer.css`])
    expect(response.headers['content-security-policy']).toContain(`style-src 'self' 'nonce-`)
    expect(response.headers['content-security-policy']).toContain(apiUrl)
    expect(response.headers['content-security-policy']).toContain(`font-src 'self' ${apiUrl}`)
  })

  it.each(['/accessibility', '/accessibility/'])('rewrites accessibility URL %s', async accessibilityUrl => {
    nock(config.apis.probationApi.url)
      .get('/api/components')
      .query({ component: ['header', 'footer'] })
      .reply(200, {
        header: { html: '', css: [], javascript: [] },
        footer: {
          html: `<footer><a href="${accessibilityUrl}">Accessibility</a></footer>`,
          css: [],
          javascript: [],
        },
      })

    const response = await request(createApp()).get('/').expect(200)

    expect(response.body.footer).toBe(
      '<footer><a href="/accessibility/accredited-programmes">Accessibility</a></footer>',
    )
  })

  it('logs API failures and renders the package fallback', async () => {
    const api = nock(config.apis.probationApi.url).get('/api/components').query(true).twice().reply(503)

    const response = await request(createApp()).get('/').expect(200)

    expect(api.isDone()).toBe(true)
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(Error),
      'Failed to retrieve front end components, using fallbacks',
    )
    expect(response.body.footer).toContain('probation-common-fallback-footer')
    expect(response.body.cssIncludes).toEqual([])
    expect(response.body.jsIncludes).toEqual([])
  })

  it('renders the local WireMock footer without requiring dev Auth tokens', async () => {
    const api = nock(config.apis.probationApi.url)
      .get('/api/components')
      .query({ component: ['header', 'footer'] })
      .reply(200, frontendComponents.mappings[0].response.jsonBody)

    const response = await request(createApp()).get('/').expect(200)

    expect(api.isDone()).toBe(true)
    expect(response.body.footer).toContain('probation-common-footer')
    expect(response.body.footer).toContain('Accessibility</a>')
    expect(response.body.footer).toContain('Cookies policy</a>')
    expect(response.body.footer).toContain('Privacy policy</a>')
    expect(response.body.footer).not.toContain('probation-common-fallback-footer')
    expect(response.body.cssIncludes).toEqual([
      'http://localhost:9095/assets/css/header.css',
      'http://localhost:9095/assets/css/footer.css',
    ])
    expect(response.headers['content-security-policy']).toContain(config.apis.probationApi.url)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('uses the package fallback without making API calls when no user is available', async () => {
    const response = await request(createApp(false)).get('/').expect(200)

    expect(logger.info).toHaveBeenCalledWith('Using fallback frontend components when no user in context')
    expect(logger.error).not.toHaveBeenCalled()
    expect(response.body.footer).toContain('probation-common-fallback-footer')
  })
})
