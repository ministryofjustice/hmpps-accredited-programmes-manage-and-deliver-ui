import { RescheduleSessionDetails, RescheduleSessionRequest } from '@manage-and-deliver-api'
import OtherSessionsPresenter from './otherSessionsPresenter'

describe('OtherSessionsPresenter', () => {
  const groupId = 'group-123'
  const rescheduleSessionDetails: RescheduleSessionDetails = {
    sessionId: 'session-456',
    sessionName: 'Getting started',
    previousSessionDateAndTime: 'Tuesday 15 June 2026 at 2:00pm to 3:00pm',
  }
  const rescheduleSessionRequest: Partial<RescheduleSessionRequest> = {
    sessionStartDate: '22/6/2026',
    sessionStartTime: {
      hour: 2,
      minutes: 0,
      amOrPm: 'PM',
    },
    sessionEndTime: {
      hour: 3,
      minutes: 0,
      amOrPm: 'PM',
    },
  }

  describe('pageTitle', () => {
    it('should return Rescheduling other sessions', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      expect(presenter.pageTitle).toBe('Rescheduling other sessions')
    })
  })

  describe('text', () => {
    it('should return correct heading and caption text', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      expect(presenter.text).toEqual({
        headingText: 'Rescheduling later sessions',
        headingCaptionText: 'Edit Getting started',
      })
    })
  })

  describe('backLinkUri', () => {
    it('should return correct back link URI', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      expect(presenter.backLinkUri).toBe('/group-123/session-456/edit-session-date-and-time')
    })
  })

  describe('errorSummary', () => {
    describe('when there is no validation error', () => {
      it('should return null', () => {
        const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

        expect(presenter.errorSummary).toBeNull()
      })
    })

    describe('when there is a validation error', () => {
      it('should return error summary', () => {
        const validationError = {
          errors: [
            {
              errorSummaryLinkedField: 'reschedule-other-sessions',
              formFields: ['reschedule-other-sessions'],
              message: 'Select whether to reschedule future sessions or not',
            },
          ],
        }
        const presenter = new OtherSessionsPresenter(
          groupId,
          rescheduleSessionDetails,
          rescheduleSessionRequest,
          validationError,
        )

        expect(presenter.errorSummary).not.toBeNull()
      })
    })
  })

  describe('sessionDateAndTimesSummary', () => {
    it('should return summary list with previous and new session date and time', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      const summary = presenter.sessionDateAndTimesSummary

      expect(summary).toHaveLength(2)
      expect(summary[0].key).toBe('Previous session date and time')
      expect(summary[0].keyClass).toBe('session-reschedule-table-key-width')
      expect(summary[0].lines).toEqual(['Tuesday 15 June 2026 at 2:00pm to 3:00pm'])

      expect(summary[1].key).toBe('New session date and time')
      expect(summary[1].keyClass).toBe('session-reschedule-table-key-width')
      expect(summary[1].lines[0]).toMatch('Monday 22 June 2026, 2pm to 3pm')
    })

    it('should handle different session times correctly', () => {
      const newRequest: Partial<RescheduleSessionRequest> = {
        sessionStartDate: '25/7/2026',
        sessionStartTime: {
          hour: 10,
          minutes: 30,
          amOrPm: 'AM',
        },
        sessionEndTime: {
          hour: 12,
          minutes: 15,
          amOrPm: 'PM',
        },
      }

      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, newRequest, null)

      const summary = presenter.sessionDateAndTimesSummary
      expect(summary[1].lines[0]).toMatch('Saturday 25 July 2026, 10:30am to 12:15pm')
    })
  })

  describe('fields', () => {
    it('should return rescheduleOtherSessions field with no error', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      const { fields } = presenter

      expect(fields.rescheduleOtherSessions).toBeDefined()
      expect(fields.rescheduleOtherSessions.value).toBeDefined()
      expect(fields.rescheduleOtherSessions.errorMessage).toBeNull()
    })

    it('should return rescheduleOtherSessions field with error message', () => {
      const validationError = {
        errors: [
          {
            errorSummaryLinkedField: 'reschedule-other-sessions',
            formFields: ['reschedule-other-sessions'],
            message: 'Select whether to reschedule future sessions or not',
          },
        ],
      }
      const presenter = new OtherSessionsPresenter(
        groupId,
        rescheduleSessionDetails,
        rescheduleSessionRequest,
        validationError,
      )

      const { fields } = presenter

      expect(fields.rescheduleOtherSessions.errorMessage).toBe('Select whether to reschedule future sessions or not')
    })
  })

  describe('utils', () => {
    it('should return PresenterUtils instance', () => {
      const presenter = new OtherSessionsPresenter(groupId, rescheduleSessionDetails, rescheduleSessionRequest, null)

      expect(presenter.utils).toBeDefined()
      expect(presenter.utils.booleanValue).toBeDefined()
    })
  })
})
