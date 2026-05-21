import { EditSessionDetails, RescheduleSessionRequest, EditSessionAttendeesResponse } from '@manage-and-deliver-api'
import EditSessionDateAndTimePresenter from './editSessionDateAndTimePresenter'

describe('EditSessionDateAndTimePresenter', () => {
  const groupId = 'group-123'
  const sessionDetails: EditSessionDetails = {
    sessionId: 'session-456',
    groupCode: 'GROUP-CODE-123',
    sessionName: 'Getting started',
    sessionDate: '22/6/2026',
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
  const sessionType: EditSessionAttendeesResponse['sessionType'] = 'GROUP'

  describe('pageTitle', () => {
    it('should return Edit the session date and time', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType)

      expect(presenter.pageTitle).toBe('Edit the session date and time')
    })
  })

  describe('text', () => {
    it('should return correct heading and caption text', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType)

      expect(presenter.text).toEqual({
        headingText: 'Edit the session date and time',
        headingCaptionText: 'Edit Getting started',
      })
    })
  })

  describe('backLinkUri', () => {
    it('should return correct back link URI', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType)

      expect(presenter.backLinkUri).toBe('/group-123/session-456/edit-session')
    })
  })

  describe('isGroupSession', () => {
    it('should return true when session type is GROUP', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, 'GROUP')

      expect(presenter.isGroupSession).toBe(true)
    })

    it('should return false when session type is not GROUP', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, 'ONE_TO_ONE')

      expect(presenter.isGroupSession).toBe(false)
    })
  })

  describe('errorSummary', () => {
    describe('when there is no validation error', () => {
      it('should return null', () => {
        const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType, null, null)

        expect(presenter.errorSummary).toBeNull()
      })
    })

    describe('when there is a validation error', () => {
      it('should return error summary', () => {
        const validationError = {
          errors: [
            {
              errorSummaryLinkedField: 'session-details-date',
              formFields: ['session-details-date'],
              message: 'Enter a valid session date',
            },
          ],
        }
        const presenter = new EditSessionDateAndTimePresenter(
          groupId,
          sessionDetails,
          sessionType,
          null,
          validationError,
        )

        expect(presenter.errorSummary).not.toBeNull()
      })
    })
  })

  describe('fields', () => {
    it('should return form fields with session details', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType)

      const { fields } = presenter

      expect(fields.sessionDate).toBeDefined()
      expect(fields.sessionDate.value).toBeDefined()
      expect(fields.startTime).toBeDefined()
      expect(fields.endTime).toBeDefined()
    })

    it('should return form fields with reschedule session storage data when available', () => {
      const rescheduleSessionStorageData: Partial<RescheduleSessionRequest> = {
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

      const presenter = new EditSessionDateAndTimePresenter(
        groupId,
        sessionDetails,
        sessionType,
        rescheduleSessionStorageData,
      )

      const { fields } = presenter

      expect(fields.sessionDate).toBeDefined()
      expect(fields.startTime).toBeDefined()
      expect(fields.endTime).toBeDefined()
    })

    it('should return error message when validation error exists', () => {
      const validationError = {
        errors: [
          {
            errorSummaryLinkedField: 'session-details-date',
            formFields: ['session-details-date'],
            message: 'Enter a valid session date',
          },
        ],
      }
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType, null, validationError)

      const { fields } = presenter

      expect(fields.sessionDate.errorMessage).toBe('Enter a valid session date')
    })
  })

  describe('utils', () => {
    it('should return PresenterUtils instance', () => {
      const presenter = new EditSessionDateAndTimePresenter(groupId, sessionDetails, sessionType)

      expect(presenter.utils).toBeDefined()
      expect(presenter.utils.stringValue).toBeDefined()
    })

    it('should return PresenterUtils with user input data when available', () => {
      const userInputData = {
        'session-details-date': '25/7/2026',
      }

      const presenter = new EditSessionDateAndTimePresenter(
        groupId,
        sessionDetails,
        sessionType,
        null,
        null,
        userInputData,
      )

      expect(presenter.utils).toBeDefined()
    })
  })
})
