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

    await request(app).get(`/group/12345/session/6789/edit-session`).expect(200)

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
      .get(`/group/12345/session/6789/edit-session`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Test Session')
        expect(res.text).toContain('15 March 2025')
        expect(res.text).toContain('9:30am to midday')
      })
  })
})

describe('editSessionDateAndTime', () => {
  describe('GET /group/:groupId/session/:session/edit-session-date-and-time', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = editSessionDetailsFactory.build()
      const sessionAttendees = editSessionAttendeesFactory.build()
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
        .get(`/group/111/session/6789/edit-session-date-and-time`)
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

  describe('POST group/:groupId/session/:session/edit-session-date-and-time', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = editSessionDetailsFactory.build()
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP' })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      return request(app)
        .post(`/group/111/session/6789/edit-session-date-and-time`)
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
          expect(res.text).toContain(`Redirecting to /group/111/session/6789/edit-session-date-and-time/reschedule`)
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
  describe('GET group/:groupId/session/:session/edit-session-date-and-time/reschedule', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .get(`/group/111/session/6789/edit-session-date-and-time/reschedule`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Rescheduling other sessions')
        })
      expect(accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails).toHaveBeenCalledWith(
        'user1',
        '6789',
      )
    })
  })

  describe('POST group/:groupId/session/:session/edit-session-date-and-time/reschedule', () => {
    it('should submit the edit session details correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      return request(app)
        .post(`/group/111/session/6789/edit-session-date-and-time/reschedule`)
        .type('form')
        .send({
          'reschedule-other-sessions': 'false',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/111/session/6789/edit-session?message=${encodeURIComponent('Test message')}`,
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

  describe('GET /group/:groupId/session/:session/edit-session-facilitators', () => {
    it('should fetch session facilitators with correct parameters and load page correctly', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      await request(app)
        .get(`/group/123/session/456/edit-session-facilitators`)
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
        .get(`/group/123/session/456/edit-session-facilitators`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Facilitator One')
          expect(res.text).toContain('Facilitator Two')
        })
    })
  })

  describe('POST /group/:groupId/session/:session/edit-session-facilitators', () => {
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
        .post(`/group/${groupId}/session/${sessionId}/edit-session-facilitators`)
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
            `Found. Redirecting to /group/${groupId}/session/${sessionId}/edit-session?message=${encodeURIComponent('Facilitators updated successfully')}`,
          )
        })
    })

    it('should handle validation errors and display error messages', async () => {
      accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators.mockResolvedValue(
        editSessionFacilitatorsResponse,
      )

      await request(app)
        .post(`/group/${groupId}/session/${sessionId}/edit-session-facilitators`)
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
        .post(`/group/${groupId}/session/${sessionId}/edit-session-facilitators`)
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
        .post(`/group/${groupId}/session/${sessionId}/edit-session-facilitators`)
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
