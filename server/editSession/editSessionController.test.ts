import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import editSessionDetailsFactory from '../testutils/factories/editSessionDetailsFactory'
import rescheduleSessionDetailsFactory from '../testutils/factories/rescheduleSessionDetailsFactory'
import editSessionAttendeesFactory from '../testutils/factories/editSessionAttendeesFactory'
import sessionDetailsFactory from '../testutils/factories/risksAndNeeds/sessionDetailsFactory'
import sessionFactory from '../testutils/factories/risksAndNeeds/sessionFactory'
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

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION',
      'user1',
      '6789',
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId: '12345' }) }),
    )

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

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION',
      'user1',
      '6789',
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId: '12345' }) }),
    )
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

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION',
      'user1',
      sessionId,
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId }) }),
    )
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

    expect(sendAuditEvent).not.toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
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

    expect(sendAuditEvent).not.toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
  })
})

describe('deleteSession', () => {
  it('should load delete session page and emit VIEW_DELETE_SESSION', async () => {
    const groupId = '12345'
    const sessionId = '6789'
    const sessionDetails = sessionFactory.build()
    accreditedProgrammesManageAndDeliverService.getSessionDetails.mockResolvedValue(sessionDetails)

    await request(app).get(`/${groupId}/${sessionId}/delete-session`).expect(200)

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_DELETE_SESSION',
      'user1',
      sessionId,
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId }) }),
    )
    expect(accreditedProgrammesManageAndDeliverService.getSessionDetails).toHaveBeenCalledWith('user1', sessionId)
  })

  it('should delete session on POST and emit REMOVE_SESSION', async () => {
    const groupId = '12345'
    const sessionId = '6789'
    accreditedProgrammesManageAndDeliverService.deleteSession.mockResolvedValue('Deleted message')

    await request(app)
      .post(`/${groupId}/${sessionId}/delete-session`)
      .type('form')
      .send({ 'delete-session': 'yes' })
      .expect(302)
      .expect('Location', `/group/${groupId}/sessions-and-attendance?editSessionMessage=Deleted%20message`)

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'REMOVE_SESSION',
      'user1',
      sessionId,
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId }) }),
    )
    expect(accreditedProgrammesManageAndDeliverService.deleteSession).toHaveBeenCalledWith('user1', sessionId)
    expect(sendAuditEvent).not.toHaveBeenCalledWith(
      'VIEW_DELETE_SESSION',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
  })
})

describe('editSessionAttendees', () => {
  it('should load edit-session-attendees page and emit VIEW_EDIT_SESSION_ATTENDEES', async () => {
    const groupId = '111'
    const sessionId = '6789'
    const sessionAttendees = editSessionAttendeesFactory.build()
    accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

    await request(app).get(`/${groupId}/${sessionId}/edit-session-attendees`).expect(200)

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION_ATTENDEES',
      'user1',
      sessionId,
      'SEARCH_TERM',
      expect.objectContaining({ details: expect.objectContaining({ groupId }) }),
    )
    expect(accreditedProgrammesManageAndDeliverService.getSessionAttendees).toHaveBeenCalledWith('user1', sessionId)
  })

  it('should submit attendees update and emit EDIT_SESSION_ATTENDEES', async () => {
    const groupId = '111'
    const sessionId = '6789'
    accreditedProgrammesManageAndDeliverService.updateSessionAttendees.mockResolvedValue('Updated')

    await request(app)
      .post(`/${groupId}/${sessionId}/edit-session-attendees`)
      .type('form')
      .send({ 'edit-session-attendees': ['referral-123'] })
      .expect(302)
      .expect('Location', `/${groupId}/${sessionId}/edit-session?editSessionMessage=Updated`)

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'EDIT_SESSION_ATTENDEES',
      'user1',
      sessionId,
      'SEARCH_TERM',
      expect.objectContaining({ details: { referralId: ['referral-123'], groupId } }),
    )
    expect(accreditedProgrammesManageAndDeliverService.updateSessionAttendees).toHaveBeenCalledWith(
      'user1',
      sessionId,
      ['referral-123'],
    )
    expect(sendAuditEvent).not.toHaveBeenCalledWith(
      'VIEW_EDIT_SESSION_ATTENDEES',
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )
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
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        'user1',
        '6789',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
      expect(accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime).toHaveBeenCalledWith(
        'user1',
        '6789',
      )
    })
  })

  describe('POST /:groupId/:sessionId/edit-session-date-and-time', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '3055-12-01',
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP' })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
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
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should submit directly when a future group session is moved to a past date', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '3055-12-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)
      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/2000',
          'session-details-start-time-hour': '9',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'AM',
        })
        .expect(302)
        .expect('Location', '/111/6789/edit-session?editSessionMessage=Test%20message')

      expect(sendAuditEvent).toHaveBeenCalledWith(
        'EDIT_SESSION_DATE_AND_TIME',
        'user1',
        '6789',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          sessionStartDate: '2000-01-01',
          sessionStartTime: { hour: 9, minutes: 0, amOrPm: 'AM' },
          sessionEndTime: { hour: 11, minutes: 30, amOrPm: 'AM' },
          rescheduleOtherSessions: false,
        },
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should submit directly for a past group session instead of redirecting to reschedule later sessions', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)
      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/2000',
          'session-details-start-time-hour': '9',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'AM',
        })
        .expect(302)
        .expect('Location', '/111/6789/edit-session?editSessionMessage=Test%20message')

      expect(sendAuditEvent).toHaveBeenCalledWith(
        'EDIT_SESSION_DATE_AND_TIME',
        'user1',
        '6789',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          sessionStartDate: '2000-01-01',
          sessionStartTime: { hour: 9, minutes: 0, amOrPm: 'AM' },
          sessionEndTime: { hour: 11, minutes: 30, amOrPm: 'AM' },
          rescheduleOtherSessions: false,
        },
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should redirect to reschedule page for an empty past group session moved to a past date', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
        isEmptyGroup: true,
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '2/1/2000',
          'session-details-start-time-hour': '10',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '12',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'PM',
        })
        .expect(302)
        .expect('Location', '/111/6789/edit-group-days-and-times/reschedule')

      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).not.toHaveBeenCalled()
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should redirect to reschedule page when a past group session is moved to a future date', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/3055',
          'session-details-start-time-hour': '10',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '12',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'PM',
        })
        .expect(302)
        .expect('Location', '/111/6789/edit-group-days-and-times/reschedule')
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should return validation error if a past session is made longer than originally scheduled', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP' })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/2000',
          'session-details-start-time-hour': '10',
          'session-details-start-time-minute': '0',
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

      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).not.toHaveBeenCalled()
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should map API 400 duration error to a field validation error instead of generic bad request', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 10, minutes: 0, amOrPm: 'AM' },
        sessionEndTime: { hour: 12, minutes: 30, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)
      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockRejectedValue(
        Object.assign(new Error('Bad Request'), {
          status: 400,
          data: {
            userMessage:
              'The session duration cannot be longer than originally scheduled. Change the start or end time.',
          },
        }),
      )

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/2000',
          'session-details-start-time-hour': '9',
          'session-details-start-time-minute': '0',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '30',
          'session-details-end-time-part-of-day': 'AM',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(
            'The session duration cannot be longer than originally scheduled. Change the start or end time.',
          )
        })
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should show an explanatory message when submitted duration is shorter than current but still rejected by API', async () => {
      const sessionDetails = editSessionDetailsFactory.build({
        sessionDate: '2000-01-01',
        sessionStartTime: { hour: 3, minutes: 51, amOrPm: 'PM' },
        sessionEndTime: { hour: 3, minutes: 59, amOrPm: 'PM' },
      })
      const sessionAttendees = editSessionAttendeesFactory.build({ sessionType: 'GROUP', isCatchup: false })
      accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime.mockResolvedValue(sessionDetails)
      accreditedProgrammesManageAndDeliverService.getSessionAttendees.mockResolvedValue(sessionAttendees)
      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockRejectedValue(
        Object.assign(new Error('Bad Request'), {
          status: 400,
          data: {
            userMessage:
              'The session duration cannot be longer than originally scheduled. Change the start or end time.',
          },
        }),
      )

      await request(app)
        .post(`/111/6789/edit-session-date-and-time`)
        .type('form')
        .send({
          'session-details-date': '1/1/2000',
          'session-details-start-time-hour': '3',
          'session-details-start-time-minute': '51',
          'session-details-start-time-part-of-day': 'PM',
          'session-details-end-time-hour': '3',
          'session-details-end-time-minute': '58',
          'session-details-end-time-part-of-day': 'PM',
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(
            'You have shortened this session, but it is still longer than the originally scheduled duration.',
          )
        })
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })
  })
})

describe('submitEditSessionDateAndTime', () => {
  const makeSessionData = (): Partial<SessionData> => ({
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
  })
  describe('GET /:groupId/:sessionId/edit-group-days-and-times/reschedule', () => {
    it('should fetch session details with correct parameters and load page correctly', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(makeSessionData(), { accreditedProgrammesManageAndDeliverService })

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
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'VIEW_SUBMIT_EDIT_SESSION_DATE_AND_TIME',
        'user1',
        '6789',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
    })
  })

  describe('POST /:groupId/:sessionId/edit-group-days-and-times/reschedule', () => {
    it('should submit with rescheduleOtherSessions false when no is selected', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(makeSessionData(), { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      await request(app)
        .post(`/111/6789/edit-group-days-and-times/reschedule`)
        .type('form')
        .send({
          'reschedule-other-sessions': 'false',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /111/6789/edit-session?editSessionMessage=${encodeURIComponent('Test message')}`,
          )
        })

      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).toHaveBeenCalledWith(
        'user1',
        sessionDetails.sessionId,
        expect.objectContaining({ rescheduleOtherSessions: false }),
      )
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'EDIT_SESSION_DATE_AND_TIME',
        'user1',
        sessionDetails.sessionId,
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_SUBMIT_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should submit with rescheduleOtherSessions true when yes is selected', async () => {
      const sessionDetails = rescheduleSessionDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails.mockResolvedValue(sessionDetails)

      app = TestUtils.createTestAppWithSession(makeSessionData(), { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime.mockResolvedValue({
        message: 'Test message',
      })

      await request(app)
        .post(`/111/6789/edit-group-days-and-times/reschedule`)
        .type('form')
        .send({
          'reschedule-other-sessions': 'true',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /111/6789/edit-session?editSessionMessage=${encodeURIComponent('Test message')}`,
          )
        })

      expect(accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime).toHaveBeenCalledWith(
        'user1',
        sessionDetails.sessionId,
        expect.objectContaining({ rescheduleOtherSessions: true }),
      )
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'EDIT_SESSION_DATE_AND_TIME',
        'user1',
        sessionDetails.sessionId,
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '111' }) }),
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_SUBMIT_EDIT_SESSION_DATE_AND_TIME',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
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

      expect(sendAuditEvent).toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        'user1',
        '123',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '123' }) }),
      )
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
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        'user1',
        '123',
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId: '123' }) }),
      )
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

      await request(app)
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
            `Found. Redirecting to /${groupId}/${sessionId}/edit-session?editSessionMessage=${encodeURIComponent('Facilitators updated successfully')}`,
          )
        })
      expect(sendAuditEvent).toHaveBeenCalledWith(
        'EDIT_SESSION_FACILITATORS',
        'user1',
        sessionId,
        'SEARCH_TERM',
        expect.objectContaining({ details: expect.objectContaining({ groupId }) }),
      )
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
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
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
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
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
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
      expect(sendAuditEvent).not.toHaveBeenCalledWith(
        'VIEW_EDIT_SESSION_FACILITATORS',
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })
  })
})
