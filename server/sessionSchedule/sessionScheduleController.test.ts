import { ModuleSessionTemplate } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
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
const groupId = randomUUID()
const moduleId = randomUUID()
const groupCode = 'DDDD1234'
const moduleName = 'Managing people around me'

const mockSessionTemplates: ModuleSessionTemplate[] = [
  {
    id: randomUUID(),
    number: 1,
    name: 'Getting started one-to-one',
  },
  {
    id: randomUUID(),
    number: 2,
    name: 'Session 2',
  },
]

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    sessionScheduleData: {
      groupIdsByCode: {
        [groupCode]: groupId,
      },
      moduleIdsByGroupAndName: {
        [groupCode]: {
          [moduleName]: moduleId,
        },
      },
      moduleNames: {
        [moduleId]: moduleName,
      },
      groupCode,
    },
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)
  accreditedProgrammesManageAndDeliverService.getGroupSessions.mockResolvedValue({
    group: {
      code: groupCode,
      regionName: 'North Region',
    },
    modules: [],
  })
  accreditedProgrammesManageAndDeliverService.getModuleSessionTemplates.mockResolvedValue({
    sessionTemplates: [],
  })
  accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
    id: groupId,
    code: groupCode,
    regionName: 'North Region',
  })
})

describe('Session Schedule Controller', () => {
  describe('GET /:groupId/:moduleId/schedule-session-type', () => {
    it('loads the session schedule which page', async () => {
      return request(app)
        .get(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started one-to-one')
          expect(accreditedProgrammesManageAndDeliverService.getSessionTemplates).toHaveBeenCalledWith(
            'user1',
            groupId,
            moduleId,
          )
        })
    })

    it('displays all available session templates', async () => {
      return request(app)
        .get(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Getting started one-to-one')
          expect(res.text).toContain('Session 2')
        })
    })

    it('uses cached session templates when available', async () => {
      const sessionData: Partial<SessionData> = {
        sessionScheduleData: {
          moduleSessionTemplates: {
            [moduleId]: mockSessionTemplates,
          },
          moduleNames: {
            [moduleId]: 'Module A',
          },
          groupCode: 'GRP1',
          groupIdsByCode: {
            GRP1: groupId,
          },
          moduleIdsByGroupAndName: {
            GRP1: {
              'Module A': moduleId,
            },
          },
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockClear()

      return request(app)
        .get(`/group/GRP1/module/${encodeURIComponent('Module A')}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Getting started one-to-one')
          expect(res.text).toContain('Session 2')
          expect(res.text).toContain('GRP1 - Module A')
          expect(accreditedProgrammesManageAndDeliverService.getSessionTemplates).not.toHaveBeenCalled()
        })
    })

    it('displays previously selected session template from session', async () => {
      const selectedTemplateId = mockSessionTemplates[1].id
      const sessionData: Partial<SessionData> = {
        sessionScheduleData: {
          moduleSessionTemplates: {
            [moduleId]: mockSessionTemplates,
          },
          sessionScheduleTemplateId: selectedTemplateId,
          groupIdsByCode: {
            [groupCode]: groupId,
          },
          moduleIdsByGroupAndName: {
            [groupCode]: {
              [moduleName]: moduleId,
            },
          },
          moduleNames: {
            [moduleId]: moduleName,
          },
          groupCode,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)

      return request(app)
        .get(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`value="${selectedTemplateId}" checked`)
        })
    })

    it('displays fallback text when no session templates are available', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue([])

      return request(app)
        .get(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a the session')
        })
    })
  })

  describe('POST /:groupId/:moduleId/schedule-session-type', () => {
    it('redirects to session details page on successful submission', async () => {
      const selectedTemplateId = mockSessionTemplates[0].id

      return request(app)
        .post(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .send({ 'session-template': selectedTemplateId })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /${groupId}/${moduleId}/schedule-group-session-details`)
        })
    })

    it('shows validation error when no session template is selected', async () => {
      return request(app)
        .post(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a session')
          expect(res.text).toContain('There is a problem')
        })
    })

    it('does not redirect when validation fails', async () => {
      const response = await request(app)
        .post(`/group/${groupCode}/module/${encodeURIComponent(moduleName)}/schedule-session-type`)
        .send({})
        .expect(400)

      expect(response.text).not.toContain('Redirecting')
      expect(response.text).toContain('Getting started one-to-one')
    })
  })

  describe('GET /group/:identifier/sessions-and-attendance', () => {
    it('loads the session attendance page when a group id is provided', async () => {
      return request(app)
        .get(`/group/${groupId}/sessions-and-attendance`)
        .expect(200)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupSessions).toHaveBeenCalledWith('user1', groupId)
          expect(accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion).not.toHaveBeenCalled()
        })
    })

    it('resolves the group code to the group id when no cache exists', async () => {
      const sessionData: Partial<SessionData> = {}
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getGroupSessions.mockResolvedValue({
        group: {
          code: groupCode,
          regionName: 'North Region',
        },
        modules: [],
      })

      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: groupId,
        code: groupCode,
        regionName: 'North Region',
      })

      return request(app)
        .get(`/group/${groupCode}/sessions-and-attendance`)
        .expect(200)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion).toHaveBeenCalledWith(
            'user1',
            groupCode,
          )
          expect(accreditedProgrammesManageAndDeliverService.getGroupSessions).toHaveBeenCalledWith('user1', groupId)
        })
    })

    it('redirects to the started groups list when the group code cannot be resolved', async () => {
      const sessionData: Partial<SessionData> = {}
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue(null)

      return request(app)
        .get('/group/UNKNOWN_CODE/sessions-and-attendance')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /groups/started')
          expect(accreditedProgrammesManageAndDeliverService.getGroupSessions).not.toHaveBeenCalled()
        })
    })
  })

  describe('GET /:groupId/:moduleId/schedule-group-session-details', () => {
    beforeEach(() => {
      accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails.mockResolvedValue({
        facilitators: [
          { personName: 'John Doe', personCode: 'N07B001', teamName: 'GM Manchester N1', teamCode: 'N50CAC' },
        ],
        groupMembers: [
          {
            name: 'John Smith',
            crn: 'JS123',
            referralId: 'Team A',
          },
        ],
      })
    })

    it('loads the session details page', async () => {
      return request(app)
        .get(`/${groupId}/${moduleId}/schedule-group-session-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Add session details')
          expect(accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails).toHaveBeenCalledWith(
            'user1',
            groupId,
            moduleId,
          )
        })
    })
  })

  describe('POST /:groupId/:moduleId/schedule-group-session-details', () => {
    const mockSessionDetails = {
      sessionTemplateName: 'Getting started one-to-one',
      referrals: [
        { id: randomUUID(), name: 'John Doe', prisonNumber: 'A1234BC' },
        { id: randomUUID(), name: 'Jane Smith', prisonNumber: 'B5678DE' },
      ],
      facilitators: [
        { facilitator: 'John Doe', facilitatorCode: 'N07B001', teamName: 'GM Manchester N1', teamCode: 'N50CAC' },
      ],
    }

    beforeEach(() => {
      accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails.mockResolvedValue({
        facilitators: [
          { personName: 'John Doe', personCode: 'N07B001', teamName: 'GM Manchester N1', teamCode: 'N50CAC' },
        ],
        groupMembers: [
          {
            name: 'John Smith',
            crn: 'JS123',
            referralId: 'Team A',
          },
        ],
      })
    })

    it('saves valid session details to session and redirects to review your session page', async () => {
      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-group-session-details`)
        .send({
          'session-details-who': [mockSessionDetails.referrals[0].id],
          'session-details-facilitator': JSON.stringify({
            facilitator: 'John Doe',
            facilitatorCode: 'N07B001',
            teamName: 'GM Manchester N1',
            teamCode: 'N50CAC',
          }),
          'session-details-date': '01/01/3055',
          'session-details-start-time-hour': '9',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'am',
          'session-details-end-time-hour': '10',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'am',
        })
        .expect(302)
        .expect(response => {
          expect(response.text).toContain(`Redirecting to /${groupId}/${moduleId}/session-review-details`)
        })
    })
  })
})
