import { ProgrammeGroupModuleSessionsResponse, ScheduleSessionTypeResponse } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { load } from 'cheerio'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'

import sendAuditEvent from '../services/auditService'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express
const groupId = randomUUID()
const moduleId = randomUUID()

const mockScheduleSessionTypeResponse: ScheduleSessionTypeResponse = {
  pageHeading: 'Schedule a Getting started one-to-one session',
  sessionTemplates: [
    {
      id: randomUUID(),
      number: 1,
      name: 'Getting started one-to-one',
      sessionScheduleType: 'SCHEDULED',
      sessionType: 'GROUP',
    },
    {
      id: randomUUID(),
      number: 2,
      name: 'Session 2',
      sessionScheduleType: 'SCHEDULED',
      sessionType: 'ONE_TO_ONE',
    },
  ],
}

const mockSessionAttendanceData: ProgrammeGroupModuleSessionsResponse = {
  group: {
    code: 'GRP-001',
    regionName: 'Test Group',
  },
  modules: [
    {
      id: moduleId,
      name: 'Module 1: Getting Started',
      scheduleButtonText: 'Schedule a Getting started one-to-one',
      sessions: [],
      number: 0,
      startDateText: {
        estimatedStartDateText: '',
        sessionStartDate: '',
      },
    },
  ],
}

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
    headingText: 'Schedule a Getting started one-to-one session',
    selectedSession: 'Selected session',
    groupOrOneToOne: 'GROUP',
    sessionScheduleType: 'SCHEDULED',
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
  accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockScheduleSessionTypeResponse)
  accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance.mockResolvedValue(mockSessionAttendanceData)
})

describe('Session Schedule Controller', () => {
  describe('GET /:groupId/:moduleId/schedule-session-type', () => {
    it('loads the session schedule which page', async () => {
      return request(app)
        .get(`/${groupId}/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started one-to-one')
          expect(res.text).toContain('Session type')
          expect(res.text).toContain('Main group session')
          expect(res.text).toContain('Catch-up')
          expect(res.text).not.toContain('value="SCHEDULED" checked')
          expect(res.text).not.toContain('value="CATCH_UP" checked')
          expect(accreditedProgrammesManageAndDeliverService.getSessionTemplates).toHaveBeenCalledWith(
            'user1',
            groupId,
            moduleId,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SCHEDULE_SESSION_TYPE', 'user1', groupId, 'SEARCH_TERM')
        })
    })

    it('displays all available session templates', async () => {
      return request(app)
        .get(`/${groupId}/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Getting started one-to-one')
          expect(res.text).toContain('Session 2')
        })
    })

    it('only displays parent sessions with nested main and catch-up choices', async () => {
      const templates = [
        { ...mockScheduleSessionTypeResponse.sessionTemplates[0], name: 'Getting started 1' },
        {
          ...mockScheduleSessionTypeResponse.sessionTemplates[0],
          id: randomUUID(),
          number: 2,
          name: 'Getting started 2',
        },
        { ...mockScheduleSessionTypeResponse.sessionTemplates[1], name: 'Getting started one-to-one' },
      ]
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue({
        ...mockScheduleSessionTypeResponse,
        sessionTemplates: templates.flatMap(template => [
          template,
          { ...template, name: `${template.name} catch-up`, sessionScheduleType: 'CATCH_UP' },
        ]),
      })

      const response = await request(app).get(`/${groupId}/${moduleId}/schedule-session-type`).expect(200)
      const $ = load(response.text)
      const parentOptions = $('input[name="session-template"]')
      expect(parentOptions).toHaveLength(3)
      expect(parentOptions.map((_, element) => $(element).val()).get()).toEqual(
        templates.map(template => `${template.id}+SCHEDULED+${template.name}+${template.sessionType}`),
      )
      templates.forEach(template => {
        const parentInput = parentOptions.filter(
          (_, element) => $(element).val() === `${template.id}+SCHEDULED+${template.name}+${template.sessionType}`,
        )
        const parentId = parentInput.attr('id')
        expect(parentId).toBeDefined()
        expect(parentInput.attr('data-aria-controls')).toBe(`conditional-${parentId}`)
        expect($(`#conditional-${parentId}`)).toHaveLength(1)

        const sessionTypeOptions = $(`input[name="session-schedule-type-${template.id}"]`)
        expect(sessionTypeOptions).toHaveLength(2)
        expect(sessionTypeOptions.map((_, element) => $(element).val()).get()).toEqual(['SCHEDULED', 'CATCH_UP'])
        sessionTypeOptions.each((_, element) => {
          const inputId = $(element).attr('id')
          expect(inputId).toBeDefined()
          expect($(`label[for="${inputId}"]`)).toHaveLength(1)
        })
      })
      templates.forEach(template => {
        expect($(`label[for="session-schedule-type-main-${template.id}"]`).text().trim()).toBe(
          template.sessionType === 'GROUP' ? 'Main group session' : 'One-to-one',
        )
        expect($(`label[for="session-schedule-type-catch-up-${template.id}"]`).text().trim()).toBe(
          template.sessionType === 'GROUP' ? 'Catch-up' : 'One-to-one catch-up',
        )
      })
      templates.forEach(template => {
        expect(response.text).not.toContain(`${template.name} catch-up`)
      })
    })

    it('displays previously selected session template from session', async () => {
      const selectedTemplateId = mockScheduleSessionTypeResponse.sessionTemplates[1]
      const checkboxValue = `${selectedTemplateId.id}+${selectedTemplateId.sessionScheduleType}+${selectedTemplateId.name}+${selectedTemplateId.sessionType}`
      const sessionData: Partial<SessionData> = {
        sessionScheduleData: {
          selectedSession: checkboxValue,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockScheduleSessionTypeResponse)

      return request(app)
        .get(`/${groupId}/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`value="${checkboxValue}" checked`)
        })
    })
  })

  describe('POST /:groupId/:moduleId/schedule-session-type', () => {
    it('redirects to session details page on successful submission', async () => {
      const selectedTemplate = mockScheduleSessionTypeResponse.sessionTemplates[0]
      const selectedSession = `${selectedTemplate.id}+${selectedTemplate.sessionScheduleType}+${selectedTemplate.name}+${selectedTemplate.sessionType}`

      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession, [`session-schedule-type-${selectedTemplate.id}`]: 'SCHEDULED' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /${groupId}/${moduleId}/schedule-session-details`)
        })
    })

    it('shows validation error when no session template is selected', async () => {
      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a session')
          expect(res.text).toContain('There is a problem')
        })
    })

    it('does not redirect when validation fails', async () => {
      const response = await request(app).post(`/${groupId}/${moduleId}/schedule-session-type`).send({}).expect(400)

      expect(response.text).not.toContain('Redirecting')
      expect(response.text).toContain('Getting started one-to-one')
    })
  })

  describe('GET /:groupId/:moduleId/schedule-session-details', () => {
    beforeEach(() => {
      const sessionData: Partial<SessionData> = {
        sessionScheduleData: {
          sessionTemplateId: '30db4cee-a79a-420a-b0ff-5f5ce4dcfd7d',
          sessionName: 'Getting started one-to-one',
          headingText: 'Schedule a Getting started one-to-one session',
          groupOrOneToOne: 'ONE_TO_ONE',
          sessionScheduleType: 'SCHEDULED',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails.mockResolvedValue({
        facilitators: [
          { personName: 'John Doe', personCode: 'N07B001', teamName: 'GM Manchester N1', teamCode: 'N50CAC' },
        ],
        groupMembers: [
          {
            name: 'John Smith',
            crn: 'JS123',
            referralId: 'Team A',
            isExcluded: true,
          },
        ],
        suggestedDate: '01/01/2026',
      })
    })

    it('requires a session type when a group template is selected', async () => {
      const selectedTemplate = mockScheduleSessionTypeResponse.sessionTemplates[0]
      const selectedSession = `${selectedTemplate.id}+${selectedTemplate.sessionScheduleType}+${selectedTemplate.name}+${selectedTemplate.sessionType}`

      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession })
        .expect(400)
        .expect(res => {
          const $ = load(res.text)
          expect($('#conditional-session-template .govuk-error-message')).toHaveLength(1)
          expect($('#conditional-session-template-2 .govuk-error-message')).toHaveLength(0)
          expect(res.text).toContain(`value="${selectedSession}" checked`)
          expect(res.text).toContain('Select a session type')
          expect(res.text).toContain('Main group session')
          expect(res.text).toContain(`id="session-schedule-type-main-${selectedTemplate.id}"`)
        })
    })

    it('shows the session type error under the currently selected parent template', async () => {
      const [firstTemplate, secondTemplate] = mockScheduleSessionTypeResponse.sessionTemplates
      const agent = request.agent(app)
      const selectedSession = (template: (typeof mockScheduleSessionTypeResponse.sessionTemplates)[number]) =>
        `${template.id}+${template.sessionScheduleType}+${template.name}+${template.sessionType}`
      const updatedSecondTemplate = { ...secondTemplate, name: `${secondTemplate.name} updated` }
      accreditedProgrammesManageAndDeliverService.getSessionTemplates
        .mockResolvedValueOnce(mockScheduleSessionTypeResponse)
        .mockResolvedValueOnce({
          ...mockScheduleSessionTypeResponse,
          sessionTemplates: [firstTemplate, updatedSecondTemplate],
        })

      await agent
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession(firstTemplate) })
        .expect(400)

      const response = await agent
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession(secondTemplate) })
        .expect(400)
      const $ = load(response.text)

      expect($('#conditional-session-template .govuk-error-message')).toHaveLength(0)
      expect($('#conditional-session-template-2 .govuk-error-message')).toHaveLength(1)
      expect($(`input[name="session-template"][value^="${secondTemplate.id}+"]`).attr('checked')).toBeDefined()
    })

    it('links session type errors to the catch-up option for catch-up-only templates', async () => {
      const selectedTemplate = {
        ...mockScheduleSessionTypeResponse.sessionTemplates[0],
        sessionScheduleType: 'CATCH_UP' as const,
      }
      const selectedSession = `${selectedTemplate.id}+${selectedTemplate.sessionScheduleType}+${selectedTemplate.name}+${selectedTemplate.sessionType}`
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue({
        ...mockScheduleSessionTypeResponse,
        sessionTemplates: [selectedTemplate],
      })

      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession })
        .expect(400)
        .expect(res => {
          const $ = load(res.text)
          const catchUpOptionId = `session-schedule-type-catch-up-${selectedTemplate.id}`
          expect($('.govuk-error-summary__list a').attr('href')).toBe(`#${catchUpOptionId}`)
          expect($(`#${catchUpOptionId}`)).toHaveLength(1)
        })
    })

    it('requires a session type for one-to-one templates', async () => {
      const selectedTemplate = mockScheduleSessionTypeResponse.sessionTemplates[1]
      const selectedSession = `${selectedTemplate.id}+${selectedTemplate.sessionScheduleType}+${selectedTemplate.name}+${selectedTemplate.sessionType}`

      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedSession })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a session type')
          expect(res.text).toContain('One-to-one')
          expect(res.text).toContain('One-to-one catch-up')
        })
    })

    it('loads the session details page', async () => {
      return request(app)
        .get(`/${groupId}/${moduleId}/schedule-session-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Add session details')
          expect(accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails).toHaveBeenCalledWith(
            'user1',
            groupId,
            moduleId,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SCHEDULE_SESSION_DETAILS', 'user1', groupId, 'SEARCH_TERM')
        })
    })
  })

  describe('POST /:groupId/:moduleId/schedule-session-details', () => {
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
            isExcluded: true,
          },
        ],
        suggestedDate: '01/01/2026',
      })
    })

    it('saves valid session details to session and redirects to review your session page', async () => {
      return request(app)
        .post(`/${groupId}/${moduleId}/schedule-session-details`)
        .send({
          'session-details-who': `a9971fd6-a185-43ee-bb23-a0ab23a14f50 + Jane Doe`,
          'session-details-facilitator-0': JSON.stringify({
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
  describe('GET /:groupId/:moduleId/session-review-details', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession(completeSessionData, { accreditedProgrammesManageAndDeliverService })
    })

    it('loads the session review details page and shows data', async () => {
      return request(app)
        .get(`/${groupId}/${moduleId}/session-review-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Review your session details')
          expect(res.text).toContain('Schedule a Getting started one-to-one')
          expect(res.text).toContain('John Doe')
        })
    })
  })

  describe('POST /:groupId/:moduleId/session-review-details', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession(completeSessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.createSessionSchedule.mockResolvedValue(
        'Getting started one-to-one for John Doe has been added.',
      )
    })

    it('creates session schedule and redirects with success message', async () => {
      return request(app)
        .post(`/${groupId}/${moduleId}/session-review-details`)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/sessions-and-attendance?successMessage=Getting%20started%20one-to-one%20for%20John%20Doe%20has%20been%20added.`,
          )
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
              sessionScheduleType: 'SCHEDULED',
              sessionTemplateId: '30db4cee-a79a-420a-b0ff-5f5ce4dcfd7d',
              startDate: '3055-01-01',
              startTime: { amOrPm: 'AM', hour: 9, minutes: 0 },
            },
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'CREATE_SCHEDULE_SESSION',
            'user1',
            groupId,
            'GROUP',
            expect.objectContaining({ details: expect.objectContaining({ startDate: '3055-01-01' }) }),
          )
        })
    })

    it.each([
      [0, 'SCHEDULED'],
      [0, 'CATCH_UP'],
      [1, 'SCHEDULED'],
      [1, 'CATCH_UP'],
    ])('creates template %i with the selected %s session type', async (templateIndex, sessionScheduleType) => {
      const selectedTemplate = mockScheduleSessionTypeResponse.sessionTemplates[templateIndex]
      const selectedSession = `${selectedTemplate.id}+${selectedTemplate.sessionScheduleType}+${selectedTemplate.name}+${selectedTemplate.sessionType}`
      const sessionAgent = request.agent(app)
      accreditedProgrammesManageAndDeliverService.getIndividualSessionDetails.mockResolvedValue({
        facilitators: [
          { personName: 'John Doe', personCode: 'N07B001', teamName: 'GM Manchester N1', teamCode: 'N50CAC' },
        ],
        groupMembers: [{ name: 'Jane Smith', crn: 'JS123', referralId: 'referral-123', isExcluded: false }],
        suggestedDate: '01/01/2026',
      })
      accreditedProgrammesManageAndDeliverService.createSessionSchedule.mockResolvedValue('Session has been added.')

      await sessionAgent
        .post(`/${groupId}/${moduleId}/schedule-session-type`)
        .send({
          'session-template': selectedSession,
          [`session-schedule-type-${selectedTemplate.id}`]: sessionScheduleType,
        })
        .expect(302)

      await sessionAgent
        .post(`/${groupId}/${moduleId}/schedule-session-details`)
        .send({
          'session-details-who': 'referral-123 + Jane Smith',
          'session-details-facilitator-0': JSON.stringify({
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

      await sessionAgent.post(`/${groupId}/${moduleId}/session-review-details`).expect(302)

      expect(accreditedProgrammesManageAndDeliverService.createSessionSchedule).toHaveBeenCalledWith(
        'user1',
        groupId,
        expect.objectContaining({
          sessionTemplateId: selectedTemplate.id,
          sessionScheduleType,
          referralIds: ['referral-123'],
        }),
      )
    })
  })
  describe('GET /group/:groupId/sessions-and-attendance', () => {
    it('loads sessions and attendance page and emits audit', async () => {
      return request(app)
        .get(`/group/${groupId}/sessions-and-attendance`)
        .expect(200)
        .expect(res => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupSessionsAndAttendance).toHaveBeenCalledWith(
            'user1',
            groupId,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_SESSIONS_AND_ATTENDANCE', 'user1', groupId, 'SEARCH_TERM')
        })
    })
  })
})
