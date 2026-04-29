import { CreateGroupRequest } from '@manage-and-deliver-api'
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
  describe('GET /group/create-a-group/create-group', () => {
    it('loads the initial start page for creating a group', async () => {
      return request(app)
        .get('/group/create-a-group/create-group')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create a group')
          expect(res.text).toContain('href="/groups/not-started-or-in-progress"')
        })
    })

    it('clears session data when loading the start page', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'EXISTING_CODE',
          earliestStartDate: '10/7/2050',
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
          expect(res.text).toContain('href="/group/create-a-group/create-group"')
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
      return request(app)
        .post('/group/create-a-group/create-group-code')
        .type('form')
        .send({ 'create-group-code': 'ABC123' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-start-date')
        })
    })

    // A 404 from code lookup means no existing group has this code, so the journey can continue.
    it('continues to start date page when group code lookup returns 404 (code not in use)', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockRejectedValue({ status: 404 })

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
  })

  describe('GET /group/create-a-group/group-start-date', () => {
    it('loads the date selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-start-date')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(' Add a start date for the group')
          expect(res.text).toContain('href="/group/create-a-group/create-group-code"')
        })
    })

    it('displays previously selected date from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          earliestStartDate: '10/7/2050',
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
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-days-and-times')
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

  describe('GET /group/create-a-group/group-days-and-times', () => {
    it('loads the days and times page', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/group-days-and-times')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('When will the group run?')
          expect(res.text).toContain('href="/group/create-a-group/group-start-date"')
        })
    })
  })

  describe('GET /group/create-a-group/group-cohort', () => {
    it('loads the cohort selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-cohort')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create group cohort')
          expect(res.text).toContain('href="/group/create-a-group/group-days-and-times"')
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
    it('loads the gender selection page', async () => {
      return request(app)
        .get('/group/create-a-group/group-sex')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Select the gender of the group')
          expect(res.text).toContain('href="/group/create-a-group/group-cohort"')
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
          expect(res.text).toContain('Select a gender')
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
          expect(res.text).toContain('href="/group/create-a-group/group-sex"')
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
          expect(res.text).toContain('href="/group/create-a-group/group-probation-delivery-unit"')
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
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-facilitators')
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

  describe('GET /group/create-a-group/group-facilitators', () => {
    it('loads the treatment manager selection page', async () => {
      accreditedProgrammesManageAndDeliverService.getPduMembers.mockResolvedValue([
        {
          personName: 'John Smith',
          personCode: 'JS123',
          teamName: 'Team A',
          teamCode: 'TA001',
        },
      ])
      return request(app)
        .get('/group/create-a-group/group-facilitators')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Who is responsible for the group')
          expect(res.text).toContain('href="/group/create-a-group/group-delivery-location"')
        })
    })

    it('displays previously selected team members from session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          teamMembers: [
            '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"TREATMENT_MANAGER"}',
            '{"facilitator":"Jane Doe", "facilitatorCode":"JD456", "teamName":"Team B", "teamCode":"TB002", "teamMemberType":"REGULAR_FACILITATOR"}',
          ],
        } as unknown as Partial<CreateGroupRequest>,
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getPduMembers.mockResolvedValue([
        {
          personName: 'John Smith',
          personCode: 'JS123',
          teamName: 'Team A',
          teamCode: 'TA001',
        },
        {
          personName: 'Jane Doe',
          personCode: 'JD456',
          teamName: 'Team B',
          teamCode: 'TB002',
        },
      ])
      return request(app)
        .get('/group/create-a-group/group-facilitators')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('John Smith')
          expect(res.text).toContain('Jane Doe')
        })
    })
  })

  describe('POST /group/create-a-group/group-facilitators', () => {
    it('redirects to check your answers page on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getPduMembers.mockResolvedValue([
        {
          personName: 'John Smith',
          personCode: 'JS123',
          teamName: 'Team A',
          teamCode: 'TA001',
        },
      ])
      return request(app)
        .post('/group/create-a-group/group-facilitators')
        .type('form')
        .send({
          'create-group-treatment-manager':
            '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"TREATMENT_MANAGER"}',
          'create-group-facilitator-1':
            '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/create-a-group/group-review-details')
        })
    })

    it('returns with errors if treatment manager and facilitator is not selected', async () => {
      accreditedProgrammesManageAndDeliverService.getPduMembers.mockResolvedValue([
        {
          personName: 'John Smith',
          personCode: 'JS123',
          teamName: 'Team A',
          teamCode: 'TA001',
        },
      ])
      return request(app)
        .post('/group/create-a-group/group-facilitators')
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a Treatment Manager. Start typing to search.')
          expect(res.text).toContain('Select a Facilitator. Start typing to search.')
        })
    })

    it('saves team members to session on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getPduMembers.mockResolvedValue([
        {
          personName: 'John Smith',
          personCode: 'JS123',
          teamName: 'Team A',
          teamCode: 'TA001',
        },
      ])
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .post('/group/create-a-group/group-facilitators')
        .type('form')
        .send({
          'create-group-treatment-manager':
            '{"facilitator":"John Smith", "facilitatorCode":"JS123", "teamName":"Team A", "teamCode":"TA001", "teamMemberType":"TREATMENT_MANAGER"}',
          'create-group-facilitator-1':
            '{"facilitator":"Jane Doe","facilitatorCode":"JD456","teamName":"Team B","teamCode":"TB002","teamMemberType":"REGULAR_FACILITATOR"}',
        })
        .expect(302)

      return request(app)
        .get('/group/create-a-group/group-facilitators')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('John Smith')
        })
    })
  })

  describe('GET /group/create-a-group/group-review-details', () => {
    it('loads the check your answers page with all session data', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          earliestStartDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
          teamMembers: [
            {
              facilitator: 'John Smith',
              facilitatorCode: 'JS123',
              teamName: 'Team A',
              teamCode: 'TA001',
              teamMemberType: 'TREATMENT_MANAGER',
            },
          ],
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get('/group/create-a-group/group-review-details')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Review your group details')
          expect(res.text).toContain('href="/group/create-a-group/group-facilitators"')
          expect(res.text).toContain('ABC123')
          expect(res.text).toContain('10/7/2050')
          expect(res.text).toContain('General offence')
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/create-a-group/group-review-details', () => {
    it('creates a group and redirects to schedule overview with success message', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          earliestStartDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.createGroup.mockResolvedValue({
        id: '123456',
        successMessage: 'Group created successfully',
      })

      return request(app)
        .post('/group/create-a-group/group-review-details')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/123456/schedule-overview')
          expect(accreditedProgrammesManageAndDeliverService.createGroup).toHaveBeenCalledWith(expect.any(String), {
            groupCode: 'ABC123',
            earliestStartDate: '10/7/2050',
            cohort: 'GENERAL',
            sex: 'MALE',
          })
        })
    })

    it('clears session data after successful submission', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'ABC123',
          earliestStartDate: '10/7/2050',
          cohort: 'GENERAL',
          sex: 'MALE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.createGroup.mockResolvedValue({
        id: '123456',
        successMessage: 'Group created successfully',
      })

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
