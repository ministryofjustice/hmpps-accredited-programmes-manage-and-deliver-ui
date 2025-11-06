import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    createGroupFormData: {},
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.createGroup.mockResolvedValue(null)
})

describe('Create Group Controller', () => {
  describe('GET /group/create-a-group/start', () => {
    it('loads the initial start page for creating a group', async () => {
      return request(app)
        .get('/group/create-a-group/start')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group')
        })
    })

    it('clears session data when loading the start page', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'EXISTING_CODE',
          cohort: 'GENERAL',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/start')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group')
        })
    })
  })

  describe('POST /group/create-a-group/start', () => {
    it('redirects to the code page', async () => {
      return request(app)
        .post('/group/create-a-group/start')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/code')
        })
    })
  })

  describe('GET /group/create-a-group/code', () => {
    it('loads the group code page', async () => {
      return request(app)
        .get('/group/create-a-group/code')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group code')
        })
    })

    it('displays previously entered group code from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/code')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('TEST123')
        })
    })
  })

  describe('POST /group/create-a-group/code', () => {
    it('redirects to cohort page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/code')
        .type('form')
        .send({
          'create-group-code': 'ABC123',
        })
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/cohort')
        })
    })

    it('returns with errors if group code is missing', async () => {
      return request(app)
        .post('/group/create-a-group/code')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Code: Please change this error message in errorMessages.ts')
        })
    })
  })

  describe('GET /group/create-a-group/cohort', () => {
    it('loads the cohort selection page', async () => {
      return request(app)
        .get('/group/create-a-group/cohort')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Select the group cohort')
        })
    })

    it('displays previously selected cohort from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          cohort: 'GENERAL',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/cohort')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('General offence')
        })
    })
  })

  describe('POST /group/create-a-group/cohort', () => {
    it('redirects to sex page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/cohort')
        .type('form')
        .send({
          'create-group-cohort': 'GENERAL',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/sex')
        })
    })

    it('returns with errors if cohort is not selected', async () => {
      return request(app)
        .post('/group/create-a-group/cohort')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Cohort: Please change this error message in errorMessages.ts')
        })
    })
  })

  describe('GET /group/create-a-group/sex', () => {
    it('loads the sex selection page', async () => {
      return request(app)
        .get('/group/create-a-group/sex')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Select the gender of the group')
        })
    })

    it('displays previously selected sex from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/sex')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/create-a-group/sex', () => {
    it('redirects to check your answers page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/sex')
        .type('form')
        .send({
          'create-group-sex': 'MALE',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/check-your-answers')
        })
    })

    it('returns with errors if sex is not selected', async () => {
      return request(app)
        .post('/group/create-a-group/sex')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Sex: Please change this error message in errorMessages.ts')
        })
    })
  })

  describe('GET /group/create-a-group/check-your-answers', () => {
    it('loads the check your answers page with all session data', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/check-your-answers')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Review your group details')
          expect(res.text).toContain('ABC123')
          expect(res.text).toContain('General offence')
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/create-a-group/check-your-answers', () => {
    it('creates a group and redirects to homepage with success message', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .post('/group/create-a-group/check-your-answers')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /?groupCreated')
          expect(accreditedProgrammesManageAndDeliverService.createGroup).toHaveBeenCalledWith(expect.any(String), {
            groupCode: 'ABC123',
            cohort: 'GENERAL',
            sex: 'MALE',
          })
        })
    })

    it('clears session data after successful submission', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app).post('/group/create-a-group/check-your-answers').expect(302)

      // Verify session is cleared by checking subsequent request
      return request(app)
        .get('/group/create-a-group/check-your-answers')
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('ABC123')
        })
    })
  })
})
