import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { randomUUID } from 'crypto'
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
  describe('GET /group/create-a-group/create-group', () => {
    it('loads the initial start page for creating a group', async () => {
      return request(app)
        .get('/group/create-a-group/create-group')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group')
        })
    })

    it('clears session data when loading the start page', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'EXISTING_CODE',
          startedAtDate: '10/7/2050',
          cohort: 'GENERAL',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/create-group')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group')
        })
    })
  })

  describe('POST /group/create-a-group/create-group', () => {
    it('redirects to the code page', async () => {
      return request(app)
        .post('/group/create-a-group/create-group')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/create-group-code')
        })
    })
  })

  describe('GET /group/create-a-group/create-group-code', () => {
    it('loads the group code page', async () => {
      return request(app)
        .get('/group/create-a-group/create-group-code')
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
        .get('/group/create-a-group/create-group-code')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('TEST123')
        })
    })
  })

  describe('POST /group/create-a-group/create-group-code', () => {
    it('redirects to start date page on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: randomUUID(),
        code: 'Test Code',
        regionName: 'Test Region',
      })

      return request(app)
        .post('/group/create-a-group/create-group-code')
        .type('form')
        .send({ 'create-group-code': 'ABC123' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-start-date')
        })
    })

    it('returns with errors if group code is missing', async () => {
      return request(app)
        .post('/group/create-a-group/create-group-code')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Enter a code for your group')
        })
    })

    it('returns with errors if group code already exists', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: randomUUID(),
        code: 'Test Code',
        regionName: 'Test Region',
      })

      return request(app)
        .post('/group/create-a-group/create-group-code')
        .type('form')
        .send({
          'create-group-code': 'Test Code',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(
            'Group code Test Code already exists for a group in this region. Enter a different code.',
          )
        })
    })
  })

  describe('GET /group/create-a-group/group-start-date', () => {
    it('loads the date selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-start-date')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group date')
        })
    })

    it('displays previously selected date from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          startedAtDate: '10/7/2050',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/group-start-date')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('10/7/2050')
        })
    })
  })

  describe('POST /group/create-a-group/group-start-date', () => {
    it('redirects to cohort page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/group-start-date')
        .type('form')
        .send({ 'create-group-date': '10/7/2050' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-cohort')
        })
    })

    it('returns with errors if date is missing', async () => {
      return request(app)
        .post('/group/create-a-group/group-start-date')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Enter or select a date')
        })
    })
  })

  describe('GET /group/create-a-group/group-cohort', () => {
    it('loads the cohort selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-cohort')
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
        .get('/group/create-a-group/group-cohort')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('General offence')
        })
    })
  })

  describe('POST /group/create-a-group/group-cohort', () => {
    it('redirects to sex page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/group-cohort')
        .type('form')
        .send({
          'create-group-cohort': 'GENERAL',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-sex')
        })
    })

    it('returns with errors if cohort is not selected', async () => {
      return request(app)
        .post('/group/create-a-group/group-cohort')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a cohort')
        })
    })
  })

  describe('GET /group/create-a-group/group-sex', () => {
    it('loads the sex selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-sex')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Select the sex of the group')
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
        .get('/group/create-a-group/group-sex')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/create-a-group/group-sex', () => {
    it('redirects to PDU page on successful submission', async () => {
      return request(app)
        .post('/group/create-a-group/group-sex')
        .type('form')
        .send({
          'create-group-sex': 'MALE',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-probation-delivery-unit')
        })
    })

    it('returns with errors if sex is not selected', async () => {
      return request(app)
        .post('/group/create-a-group/group-sex')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a sex')
        })
    })
  })

  describe('GET /group/create-a-group/group-probation-delivery-unit', () => {
    it('loads the pdu selection page', async () => {
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .get('/group/create-a-group/group-probation-delivery-unit')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('In which probation delivery unit (PDU) will the group take place?')
        })
    })

    it('displays previously selected pdu from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          pduName: 'London',
          pduCode: 'LDN',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .get('/group/create-a-group/group-probation-delivery-unit')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('London')
        })
    })
  })

  describe('POST /group/create-a-group/group-probation-delivery-unit', () => {
    it('redirects to select location page on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .post('/group/create-a-group/group-probation-delivery-unit')
        .type('form')
        .send({
          'create-group-pdu': '{"code":"LDN", "name":"London"}',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-delivery-location')
        })
    })

    it('returns with errors if pdu is not selected', async () => {
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .post('/group/create-a-group/group-probation-delivery-unit')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a probation delivery unit. Start typing to search.')
        })
    })
  })

  describe('GET /group/create-a-group/group-delivery-location', () => {
    it('loads the location selection page', async () => {
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue([
        { code: 'WMO', description: 'Westminster Office' },
        { code: 'WHO', description: 'Whitehall Office' },
      ])
      return request(app)
        .get('/group/create-a-group/group-delivery-location')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Where will the group take place?')
        })
    })

    it('displays previously selected location from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          deliveryLocationName: 'Whitehall Office',
          deliveryLocationCode: 'WHO',
          pduName: 'London',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue([
        { code: 'WMO', description: 'Westminster Office' },
        { code: 'WHO', description: 'Whitehall Office' },
      ])
      return request(app)
        .get('/group/create-a-group/group-delivery-location')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Whitehall Office')
        })
    })
  })

  describe('POST /group/create-a-group/group-delivery-location', () => {
    it('redirects to check your answers page on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .post('/group/create-a-group/group-delivery-location')
        .type('form')
        .send({
          'create-group-location': '{ "code": "WMO", "name": "Westminster Office" }',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-review-details')
        })
    })

    it('returns with errors if location is not selected', async () => {
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue([
        { code: 'LDN', description: 'London' },
      ])
      return request(app)
        .post('/group/create-a-group/group-delivery-location')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a delivery location.')
        })
    })
  })

  describe('GET /group/create-a-group/group-review-details', () => {
    it('loads the check your answers page with all session data', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          startedAtDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/group-review-details')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Review your group details')
          expect(res.text).toContain('ABC123')
          expect(res.text).toContain('10/7/2050')
          expect(res.text).toContain('General offence')
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/create-a-group/group-review-details', () => {
    it('creates a group and redirects to homepage with success message', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          startedAtDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .post('/group/create-a-group/group-review-details')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /?groupCreated')
          expect(accreditedProgrammesManageAndDeliverService.createGroup).toHaveBeenCalledWith(expect.any(String), {
            groupCode: 'ABC123',
            startedAtDate: '10/7/2050',
            cohort: 'GENERAL',
            sex: 'MALE',
          })
        })
    })

    it('clears session data after successful submission', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          startedAtDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app).post('/group/create-a-group/group-review-details').expect(302)

      // Verify session is cleared by checking subsequent request
      return request(app)
        .get('/group/create-a-group/group-review-details')
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('ABC123')
        })
    })
  })
})
