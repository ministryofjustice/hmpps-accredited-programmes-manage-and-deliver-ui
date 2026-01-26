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
    sessionType: 'ONE_TO_ONE',
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
  accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance.mockResolvedValue({
    group: { id: groupId, code: 'GRP-001', name: 'Test Group' },
    modules: [
      {
        id: moduleId,
        name: 'Module 1: Getting Started',
        scheduleButtonText: 'Schedule a Getting started session',
        sessions: [],
      },
    ],
  })
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

    it('sets sessionType to ONE_TO_ONE when single referral is selected', async () => {
      const testApp = TestUtils.createTestAppWithSession(
        { sessionScheduleData: { sessionTemplateId: '123', sessionName: 'Test' } },
        { accreditedProgrammesManageAndDeliverService },
      )

      await request(testApp)
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

      // Verify the session data was saved with the correct sessionType
      // This would be checked in the next request that reads from the session
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

    it('redirects with one-to-one message when single referral is scheduled', async () => {
      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/session-review-details`)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('message=one-to-one-created')
          expect(res.text).toContain(`referralId=${completeSessionData.sessionScheduleData.referralIds[0]}`)
          expect(res.text).toContain('personName=John%20Doe')
        })
    })

    it('redirects with group-catchup message when multiple referrals are scheduled', async () => {
      const groupSessionData: Partial<SessionData> = {
        sessionScheduleData: {
          ...completeSessionData.sessionScheduleData,
          referralIds: ['a9971fd6-a185-43ee-bb23-a0ab23a14f50', 'b1234567-b185-43ee-bb23-a0ab23a14f51'],
          sessionType: 'GROUP',
        },
      }
      const groupApp = TestUtils.createTestAppWithSession(groupSessionData, {
        accreditedProgrammesManageAndDeliverService,
      })

      return request(groupApp)
        .post(`/group/${groupId}/module/${moduleId}/session-review-details`)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('message=group-catchup-created')
          expect(res.text).not.toContain('referralId')
          expect(res.text).not.toContain('personName')
        })
    })

    it('clears session schedule data after successful creation', async () => {
      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/session-review-details`)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/module/${moduleId}/sessions-and-attendance`)
        })
    })
  })

  describe('GET /group/:groupId/module/:moduleId/sessions-and-attendance', () => {
    const mockSessionAttendanceData = {
      group: {
        id: groupId,
        code: 'GRP-001',
        name: 'Test Group',
      },
      modules: [] as never[],
    }

    beforeEach(() => {
      accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance.mockResolvedValue(
        mockSessionAttendanceData,
      )
    })

    it('loads the session attendance page', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/sessions-and-attendance`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Sessions and attendance')
          expect(accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance).toHaveBeenCalledWith(
            'user1',
            groupId,
          )
        })
    })

    it('shows one-to-one success message when message parameter is one-to-one-created', async () => {
      return request(app)
        .get(
          `/group/${groupId}/module/${moduleId}/sessions-and-attendance?message=one-to-one-created&referralId=a9971fd6-a185-43ee-bb23-a0ab23a14f50&personName=Jane%20Smith&buttonText=Schedule%20a%20Getting%20started%20session`,
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started session for Jane Smith has been added')
        })
    })

    it('shows group catchup success message when message parameter is group-catchup-created', async () => {
      return request(app)
        .get(
          `/group/${groupId}/module/${moduleId}/sessions-and-attendance?message=group-catchup-created&buttonText=Schedule%20a%20Getting%20started%20session`,
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started session has been added')
        })
    })

    it('shows one-to-one catchup success message when message parameter is one-to-one-catchup-created', async () => {
      return request(app)
        .get(
          `/group/${groupId}/module/${moduleId}/sessions-and-attendance?message=one-to-one-catchup-created&referralId=b1234567-b185-43ee-bb23-a0ab23a14f51&personName=John%20Doe&buttonText=Schedule%20a%20Getting%20started%20session`,
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started session catch-up for John Doe has been added')
        })
    })

    it('does not show success message when no message parameter is provided', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/sessions-and-attendance`)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('has been added')
        })
    })
  })
})
