import request from 'supertest'
import { Express } from 'express'
import { SessionData } from 'express-session'
import TestUtils from '../testutils/testUtils'

let app: Express

describe('HomeController', () => {
  describe('When region restriction is enabled', () => {
    beforeAll(() => {
      process.env.ENABLE_REGION_RESTRICTION = 'true'
    })
    afterAll(() => {
      delete process.env.ENABLE_REGION_RESTRICTION
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
      delete process.env.ENABLE_REGION_RESTRICTION
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
})
