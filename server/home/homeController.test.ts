import request from 'supertest'
import { Express } from 'express'
import { SessionData } from 'express-session'
import TestUtils from '../testutils/testUtils'

let app: Express

describe('HomeController', () => {
  it.each([
    ['a known region', { userRegion: { regionCode: 'N53', regionDescription: 'Known region' } }],
    ['an unknown region', { userRegion: { regionCode: 'UNKNOWN', regionDescription: 'Unknown region' } }],
    ['no region in session', { userRegion: undefined }],
  ])('renders the home page and navigation for %s', async (_description, sessionData: Partial<SessionData>) => {
    app = TestUtils.createTestAppWithSession(sessionData, {})

    return request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Accredited Programmes')
        expect(res.text).toContain('href="/region/open-referrals"')
        expect(res.text).toContain('href="/groups/not-started-and-in-progress"')
      })
  })
})
