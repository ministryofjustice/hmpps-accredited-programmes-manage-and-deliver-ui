import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import editSessionDetailsFactory from '../testutils/factories/editSessionDetailsFactory'
import rescheduleSessionDetailsFactory from '../testutils/factories/rescheduleSessionDetailsFactory'
import editSessionAttendeesFactory from '../testutils/factories/editSessionAttendeesFactory'
import sessionDetailsFactory from '../testutils/factories/risksAndNeeds/sessionDetailsFactory'
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
  const sessionData: Partial<SessionData> = {}
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
})

describe('editSession', () => {
  it('should fetch session details with correct parameters', async () => {
    const sessionDetails = sessionDetailsFactory.build()
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app).get(`/12345/6789/edit-session`).expect(200)

    expect(accreditedProgrammesManageAndDeliverService.getGroupSessionDetails).toHaveBeenCalledWith(
      'user1',
      '12345',
      '6789',
    )
  })

  it('loads the session details page and displays all related data', async () => {
    const sessionDetails = sessionDetailsFactory.build()
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app)
      .get(`/12345/6789/edit-session`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('<title>Test Session - Accredited Programmes</title>')
        expect(res.text).toContain('Test Session')
        expect(res.text).toContain('15 March 2025')
        expect(res.text).toContain('9:30am to midday')
      })
  })

  it('normalises one-to-one title and slug on the session-slug route', async () => {
    const groupId = 'd721e8ad-948d-4e48-bff9-9c6fc1c26ece'
    const sessionId = '89180e89-a335-4ce8-bfad-2ea61620a444'
    const sessionDetails = sessionDetailsFactory.build({
      pageTitle: 'Alex River S688890821: Getting started one-to-one',
      sessionType: 'Individual',
      attendanceAndSessionNotes: [
        {
          referralId: 'referral-123',
          name: 'Alex River',
          crn: 'S688890821',
          attendance: 'Attended',
          sessionNotes: 'Notes recorded',
        },
      ],
    })
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app)
      .get(`/${groupId}/${sessionId}/barton-pfannerstill-s688890821`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('<title>Getting started one-to-one - Accredited Programmes</title>')
        expect(res.text).toContain('Getting started one-to-one')
        expect(res.text).toContain(`/${groupId}/${sessionId}/getting-started-one-to-one-attendance-and-session-notes`)
 
      })
  })

  it('redirects to module attendance route with slug suffix when updating attendance and notes', async () => {
    const groupId = '12345'
    const sessionId = '6789'
    const sessionDetails = sessionDetailsFactory.build({
      pageTitle: 'Getting started 1',
      attendanceAndSessionNotes: [
        {
          referralId: 'referral-123',
          name: 'Alex River',
          crn: 'S688890821',
          attendance: 'Attended',
          sessionNotes: 'Notes recorded',
        },
      ],
    })
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app)
      .post(`/${groupId}/${sessionId}/edit-session`)
      .type('form')
      .send({
        'multi-select-selected': ['referral-123'],
      })
      .expect(302)
      .expect('Location', `/${groupId}/${sessionId}/getting-started-1-attendance`)
  })

  it('redirects to catch-up attendance route when session is catch-up', async () => {
    const groupId = '12345'
    const sessionId = '6789'
    const sessionDetails = sessionDetailsFactory.build({
      pageTitle: 'Managing myself 4',
      isCatchup: true,
      attendanceAndSessionNotes: [
        {
          referralId: 'referral-123',
          name: 'Alex River',
          crn: 'S688890821',
          attendance: 'Attended',
          sessionNotes: 'Notes recorded',
        },
      ],
    })
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app)
      .post(`/${groupId}/${sessionId}/edit-session`)
      .type('form')
      .send({
        'multi-select-selected': ['referral-123'],
      })
      .expect(302)
      .expect('Location', `/${groupId}/${sessionId}/managing-myself-4-catch-up-attendance`)
  })
})

describe('editSessionDateAndTime', () => {
  describe('GET /:groupId/:sessionId/edit-session-date-and-time', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = editSessionDetailsFactory.build()
      const sessionAttendees = editSessionAttendeesFactory.build()
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
        .get(`/111/6789/edit-session-date-and-time`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit the session date and time')
        })
      expect(accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime).toHaveBeenCalledWith(
        'user1',
        '6789',
      )
    })
  })

  describe('POST /:groupId/:sessionId/edit-session-date-and-time', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = editSessionDetailsFactory.build({ sessionDate: '3055-12-15' })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP' })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      return request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '15/12/3055',
          'session-details-start-time-hour': '12',
          'session-details-start-time-minute': '59',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '2',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'PM',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /111/6789/edit-group-days-and-times/reschedule`)
        })
    })
  })
})

describe('submitEditSessionDateAndTime', () => {
  const sessionData: Partial<SessionData> = {
    editSessionDateAndTime: {
      sessionStartDate: '12/12/2026',
      sessionStartTime: {
        hour: 9,
        minutes: 30,
        amOrPm: 'AM',
      },
      sessionEndTime: {
        hour: 12,
        minutes: 0,
        amOrPm: 'PM',
      },
    },
  }
  describe('GET /:groupId/:sessionId/edit-group-days-and-times/reschedule', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .get(`/111/6789/edit-group-days-and-times/reschedule`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Rescheduling later sessions')
        })
      expect(accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails).toHaveBeenCalledWith(
        'user1',
        '6789',
      )
    })
  })

  it('shows error when a past session duration is increased to more than 2.5 hours', async () => {
    const sessionDetails = editSessionDetailsFactory.build({ sessionDate: '01/01/2020' })
    const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'ONE_TO_ONE' })
    accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
    accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

    await request(app)
      .post(`/111/6789/edit-session-date-and-time`)
      .type('form')
      .send({
        'session-details-date': '01/01/2020',
        'session-details-start-time-hour': '10',
        'session-details-start-time-minute': '00',
        'session-details-start-time-part-of-day': 'AM',
        'session-details-end-time-hour': '12',
        'session-details-end-time-minute': '31',
        'session-details-end-time-part-of-day': 'PM',
      })
      .expect(400)
      .expect(res => {
        expect(res.text).toContain(
          'The session duration cannot be longer than originally scheduled. Change the start or end time.',
        )
      })
  })

  it('shows validation error when session has already ended', async () => {
    // Use yesterday to ensure the session is definitely in the past
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayIso = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
      yesterday.getDate(),
    ).padStart(2, '0')}`

    const sessionDetails = editSessionDetailsFactory.build({
      sessionDate: yesterdayIso,
      sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
      sessionEndTime: { hour: 11, minutes: 0, amOrPm: 'AM' },
    })
    const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'ONE_TO_ONE' })
    accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
    accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

    // Mock the API call in case validation doesn't trigger
    accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
      message: 'Test message',
    })

    const [year, month, day] = yesterdayIso.split('-')
    const yesterdayUk = `${day}/${month}/${year}`

    // Attempt to extend the end time beyond the original duration
    await request(app)
      .post(`/111/6789/edit-session-date-and-time`)
      .type('form')
      .send({
        'session-details-date': yesterdayUk,
        'session-details-start-time-hour': '10',
        'session-details-start-time-minute': '00',
        'session-details-start-time-part-of-day': 'AM',
        'session-details-end-time-hour': '1',
        'session-details-end-time-minute': '30',
        'session-details-end-time-part-of-day': 'PM',
      })
      .expect(400)
      .expect(res => {
        expect(res.text).toContain(
          'The session duration cannot be longer than originally scheduled. Change the start or end time.',
        )
      })
  })
})

describe('submitEditSessionDateAndTime', () => {
  const sessionData: Partial<SessionData> = {
    editSessionDateAndTime: {
      sessionStartDate: '12/12/2026',
      sessionStartTime: {
        hour: 9,
        minutes: 30,
        amOrPm: 'AM',
      },
      sessionEndTime: {
        hour: 12,
        minutes: 0,
        amOrPm: 'PM',
      },
    },
  }
  describe('GET /:groupId/:sessionId/edit-session-date-and-time/reschedule', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .get(`/111/6789/edit-group-days-and-times/reschedule`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Rescheduling later sessions')
        })
      expect(accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails).toHaveBeenCalledWith(
        'user1',
        '6789',
      )
    })
  })

  describe('POST /:groupId/:sessionId/edit-session-date-and-time/reschedule', () => {
    it('should submit the edit session details correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      return request(app)
        .post(`/111/6789/edit-group-days-and-times/reschedule`)
        .type('form')
        .send({
          'reschedule-other-sessions': 'false',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /111/6789/edit-session?message=${encodeURIComponent('Test message')}`,
          )
        })
    })
  })
})

describe('editSessionFacilitators', () => {
  const editSessionFacilitatorsResponse = {
    pageTitle: 'Getting Started 1',
    facilitators: [
      {
        facilitatorName: 'Facilitator One',
        facilitatorCode: 'F001',
        teamName: 'Team A',
        teamCode: 'TA01',
        currentlyFacilitating: true,
      },
      {
        facilitatorName: 'Facilitator Two',
        facilitatorCode: 'F002',
        teamName: 'Team B',
        teamCode: 'TA02',
        currentlyFacilitating: false,
      },
    ],
  }

  describe('GET /:groupId/:sessionId/edit-session-facilitators', () => {
    it('should fetch session facilitators with correct parameters and load page correctly', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      await request(app)
        .get(`/123/456/edit-session-facilitators`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit the session facilitators')
          expect(res.text).toContain('Getting Started 1')
        })

      expect(accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators).toHaveBeenCalledWith(
        'user1',
        '456',
      )
    })

    it('should display facilitator options', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      await request(app)
        .get(`/123/456/edit-session-facilitators`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Facilitator One')
          expect(res.text).toContain('Facilitator Two')
        })
    })
  })

  describe('POST /:groupId/:sessionId/edit-session-facilitators', () => {
    const groupId = randomUUID()
    const sessionId = randomUUID()
    it('should submit facilitators update successfully and redirect with success message', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )
      accreditedProgrammesManageAndDeliverService.updateSessionFacilitators.mockResolvedValue(
        'Facilitators updated successfully',
      )

      return request(app)
        .post(`/${groupId}/${sessionId}/edit-session-facilitators`)
        .type('form')
        .send({
          'edit-session-facilitator-0':
            '{"facilitator":"Facilitator One", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
          'edit-session-facilitator-1':
            '{"facilitator":"Facilitator Two", "facilitatorCode":"F002", "teamName":"Team B", "teamCode":"TA02"}',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Found. Redirecting to /${groupId}/${sessionId}/edit-session?message=${encodeURIComponent('Facilitators updated successfully')}`,
          )
        })
    })

    it('should handle validation errors and display error messages', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      await request(app)
        .post(`/${groupId}/${sessionId}/edit-session-facilitators`)
        .type('form')
        .send({
          'edit-session-facilitator-0': '',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Edit the session facilitators')
        })
    })

    it('should store facilitators in session on successful submission', async () => {
      const sessionData: Partial<SessionData> = {}
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )
      accreditedProgrammesManageAndDeliverService.updateSessionFacilitators.mockResolvedValue(
        'Facilitators updated successfully',
      )

      const agent = request.agent(app)

      await agent
        .post(`/${groupId}/${sessionId}/edit-session-facilitators`)
        .type('form')
        .send({
          'edit-session-facilitator-0':
            '{"facilitator":"Facilitator One", "facilitatorCode":"F001", "teamName":"Team A", "teamCode":"TA01"}',
        })
        .expect(302)

      expect(accreditedProgrammesManageAndDeliverService.updateSessionFacilitators).toHaveBeenCalled()
    })

    it('should pass userInputData to presenter when validation fails', async () => {
      const sessionData: Partial<SessionData> = {
        sessionFacilitators: [],
      }
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .post(`/${groupId}/${sessionId}/edit-session-facilitators`)
        .type('form')
        .send({
          'edit-session-facilitator-0': '',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Edit the session facilitators')
        })
    })
  })
})
