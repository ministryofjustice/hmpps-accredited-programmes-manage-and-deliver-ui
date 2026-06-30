import request from 'supertest'
import { Express } from 'express'
import { SessionData } from 'express-session'
import TestUtils from '../testutils/testUtils'
import config from '../config'

jest.mock('../config')

let app: Express

describe('HomeController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When region restriction is enabled', () => {
    beforeAll(() => {
      ;(config as jest.Mocked<typeof config>).enable_region_restriction = true
    })

    it('renders the home page when region is allowed', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'N53', regionDescription: 'Allowed region' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Accredited Programmes')
          expect(res.text).not.toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders the invalid region page when region is not allowed', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'UNKNOWN', regionDescription: 'Not allowed' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders the invalid region page when region is only allowed in DEV', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'N02', regionDescription: 'DEV region' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders the invalid region page when region is not in session', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: undefined,
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('You cannot access the Accredited Programmes service yet')
        })
    })
  })

  describe('When region restriction is disabled', () => {
    beforeAll(() => {
      ;(config as jest.Mocked<typeof config>).enable_region_restriction = false
    })

    it('renders the home page when region is allowed', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'N53', regionDescription: 'Allowed region' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Accredited Programmes')
          expect(res.text).not.toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders the home page for any region when restriction disabled', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'UNKNOWN', regionDescription: 'Not allowed' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Accredited Programmes')
          expect(res.text).not.toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders the home page if region is not in session', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: undefined,
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Accredited Programmes')
          expect(res.text).not.toContain('You cannot access the Accredited Programmes service yet')
        })
    })
  })

  describe('When ENVIRONMENT_NAME=DEV and region restriction is enabled', () => {
    beforeAll(() => {
      ;(config as jest.Mocked<typeof config>).enable_region_restriction = true
      ;(config as jest.Mocked<typeof config>).environmentName = 'DEV'
    })

    it('renders home page for DEV only region', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'N02', regionDescription: 'DEV region' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Accredited Programmes')
          expect(res.text).not.toContain('You cannot access the Accredited Programmes service yet')
        })
    })

    it('renders invalid region page for region not in DEV_ALLOWED_REGIONS', async () => {
      const sessionData: Partial<SessionData> = {
        userRegion: { regionCode: 'Y02', regionDescription: 'Not allowed' },
      }
      app = TestUtils.createTestAppWithSession(sessionData, {})

      return request(app)
        .get('/')
        .expect(403)
        .expect(res => {
          expect(res.text).toContain('You cannot access the Accredited Programmes service yet')
        })
    })
  })
})
