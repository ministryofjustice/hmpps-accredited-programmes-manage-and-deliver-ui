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

const completeSessionData: Partial<SessionData> = {
  sessionScheduleData: {
    sessionTemplateId: '30db4cee-a79a-420a-b0ff-5f5ce4dcfd7d',
    sessionName: 'Getting started one-to-one',
    referralIds: ['a9971fd6-a185-43ee-bb23-a0ab23a14f50'],
    referralName: 'John Doe',
    facilitators: [
      {
        facilitator: 'John Doe',
        facilitatorCode: 'N07B001',
        teamName: 'GM Manchester N1',
        teamCode: 'N50CAC',
        teamMemberType: 'REGULAR_FACILITATOR',
      },
    ],
    startDate: '01/01/3055',
    startTime: { hour: 9, minutes: 0, amOrPm: 'AM' },
    endTime: { hour: 10, minutes: 30, amOrPm: 'AM' },
  },
}

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    sessionScheduleData: {},
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)
})

describe('Session Schedule Controller', () => {
  describe('GET /group/:groupId/module/:moduleId/schedule-session-type', () => {
    it('loads the session schedule which page', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
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
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Getting started one-to-one')
          expect(res.text).toContain('Session 2')
        })
    })

    it('displays previously selected session template from session', async () => {
      const selectedTemplateId = mockSessionTemplates[1].id
      const sessionData: Partial<SessionData> = {
        sessionScheduleData: {
          sessionTemplateId: selectedTemplateId,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)

      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`value="${selectedTemplateId}" checked`)
        })
    })

    it('displays fallback text when no session templates are available', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue([])

      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a the session')
        })
    })
  })

  describe('POST /group/:groupId/module/:moduleId/schedule-session-type', () => {
    it('redirects to session details page on successful submission', async () => {
      const selectedTemplateId = mockSessionTemplates[0].id

      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedTemplateId })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/module/${moduleId}/schedule-group-session-details`,
          )
        })
    })

    it('shows validation error when no session template is selected', async () => {
      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a session')
          expect(res.text).toContain('There is a problem')
        })
    })

    it('does not redirect when validation fails', async () => {
      const response = await request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({})
        .expect(400)

      expect(response.text).not.toContain('Redirecting')
      expect(response.text).toContain('Getting started one-to-one')
    })
  })

  describe('GET /group/:groupId/module/:moduleId/schedule-group-session-details', () => {
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
        .get(`/group/${groupId}/module/${moduleId}/schedule-group-session-details`)
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

  describe('POST /group/:groupId/module/:moduleId/schedule-group-session-details', () => {
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
        .post(`/group/${groupId}/module/${moduleId}/schedule-group-session-details`)
        .send({
          'session-details-who': `a9971fd6-a185-43ee-bb23-a0ab23a14f50 + Jane Doe`,
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
          expect(response.text).toContain(`Redirecting to /group/${groupId}/module/${moduleId}/session-review-details`)
        })
    })
  })
  describe('GET /group/:groupId/module/:moduleId/session-review-details', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession(completeSessionData, { accreditedProgrammesManageAndDeliverService })
    })

    it('loads the session review details page and shows data', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/session-review-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Review your session details')
          expect(res.text).toContain('Schedule a Getting started one-to-one')
          expect(res.text).toContain('John Doe')
        })
    })
  })

  describe('POST /group/:groupId/module/:moduleId/session-review-details', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession(completeSessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.createSessionSchedule.mockResolvedValue({
        message: 'Session scheduled successfully',
      })
    })

    it('creates session schedule and redirects with success message', async () => {
      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/session-review-details`)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/module/${moduleId}/sessions-and-attendance`)
          expect(accreditedProgrammesManageAndDeliverService.createSessionSchedule).toHaveBeenCalledWith(
            'user1',
            groupId,
            {
              endTime: { amOrPm: 'AM', hour: 10, minutes: 30 },
              facilitators: [
                {
                  facilitator: 'John Doe',
                  facilitatorCode: 'N07B001',
                  teamCode: 'N50CAC',
                  teamMemberType: 'REGULAR_FACILITATOR',
                  teamName: 'GM Manchester N1',
                },
              ],
              referralIds: ['a9971fd6-a185-43ee-bb23-a0ab23a14f50'],
              sessionTemplateId: '30db4cee-a79a-420a-b0ff-5f5ce4dcfd7d',
              startDate: '3055-01-01',
              startTime: { amOrPm: 'AM', hour: 9, minutes: 0 },
            },
          )
        })
    })
  })
})
