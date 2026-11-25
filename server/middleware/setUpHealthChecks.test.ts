import express from 'express'
import nock from 'nock'
import request from 'supertest'
import type { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import setUpHealthChecks from './setUpHealthChecks'

jest.mock('../../logger')

const applicationInfo: ApplicationInfo = {
  applicationName: 'test-app',
  buildNumber: '1',
  gitRef: 'abcdef1234567',
  gitShortHash: 'abcdef1',
  productId: 'TEST',
  branchName: 'main',
}

function createApp() {
  const app = express()
  app.use(setUpHealthChecks(applicationInfo))
  return app
}

describe('setUpHealthChecks', () => {
  beforeAll(() => {
    if (!nock.isActive()) nock.activate()
  })

  beforeEach(() => {
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')

    nock(config.apis.hmppsAuth.url).get('/health/ping').reply(200, { status: 'UP' })
    nock(config.apis.tokenVerification.url).get('/health/ping').reply(200, { status: 'UP' })
    nock(config.apis.accreditedProgrammesManageAndDeliverService.url).get('/health').reply(200, { status: 'UP' })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  afterAll(() => {
    nock.restore()
  })

  it('reports UP when every API is healthy', async () => {
    // The path is deliberately not read from config: /health/ping on this API redirects to its sign-in page
    const probationApi = nock(config.apis.probationApi.url).get('/ping').reply(200, { status: 'UP' })

    const response = await request(createApp()).get('/health').expect(200)

    expect(probationApi.isDone()).toBe(true)
    expect(response.body.status).toBe('UP')
    expect(response.body.components).toMatchObject({
      probationApi: { status: 'UP' },
      hmppsAuth: { status: 'UP' },
      accreditedProgrammesManageAndDeliverService: { status: 'UP' },
    })
  })

  it('reports DOWN and identifies the API that is unhealthy', async () => {
    nock(config.apis.probationApi.url).get('/ping').times(3).reply(503)

    const response = await request(createApp()).get('/health').expect(500)

    expect(response.body.status).toBe('DOWN')
    expect(response.body.components).toMatchObject({
      probationApi: { status: 'DOWN', details: { status: 503, attempts: 3 } },
      hmppsAuth: { status: 'UP' },
      accreditedProgrammesManageAndDeliverService: { status: 'UP' },
    })
  })

  it('responds to /ping without calling any API', async () => {
    const probationApi = nock(config.apis.probationApi.url).get('/ping').reply(200, { status: 'UP' })

    const response = await request(createApp()).get('/ping').expect(200)

    expect(response.body).toEqual({ status: 'UP' })
    expect(probationApi.isDone()).toBe(false)
  })
})
