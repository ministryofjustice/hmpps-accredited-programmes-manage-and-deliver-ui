import { Session } from '@manage-and-deliver-api'
import EditSessionAttendanceWhoPresenter from './editSessionAttendanceWhoPresenter'
import { FormValidationError } from '../../utils/formValidationError'

describe('EditSessionAttendanceWhoPresenter', () => {
  const groupId = 'group-123'
  const backUrl = '/back-url'

  const mockSessionDetails: Session = {
    id: 'session-123',
    type: 'Individual',
    name: 'Getting started',
    number: 1,
    isCatchup: false,
    referrals: [
      {
        id: 'referral-1',
        personName: 'John Doe',
        crn: 'X123456',
        createdAt: '2024-01-01',
        status: 'REFERRED',
        cohort: 'GENERAL_OFFENCE',
      },
      {
        id: 'referral-2',
        personName: 'Jane Smith',
        crn: 'Y654321',
        createdAt: '2024-01-02',
        status: 'REFERRED',
        cohort: 'SEXUAL_OFFENCE',
      },
    ],
  } as Session

  describe('text', () => {
    it('should return correct page heading and caption', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails)

      expect(presenter.text).toEqual({
        pageHeading: 'Getting started',
        pageCaption: 'John Doe',
      })
    })

    it('should return empty string for pageCaption when referrals array is empty', () => {
      const emptySessionDetails: Session = {
        ...mockSessionDetails,
        referrals: [],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, emptySessionDetails)

      expect(presenter.text).toEqual({
        pageHeading: 'Getting started',
        pageCaption: '',
      })
    })
  })

  describe('backLinkArgs', () => {
    it('should return correct back link arguments', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails)

      expect(presenter.backLinkArgs).toEqual({
        text: 'Back',
        href: backUrl,
      })
    })
  })

  describe('generateAttendeeRadioOptions', () => {
    it('should generate radio options for all referrals without selection', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails)

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: false,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: false,
        },
      ])
    })

    it('should generate radio options with first referral selected', () => {
      const userInputData = {
        'edit-session-attendance-who': 'referral-1',
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails, null, userInputData)

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: false,
        },
      ])
    })

    it('should generate radio options with second referral selected', () => {
      const userInputData = {
        'edit-session-attendance-who': 'referral-2',
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails, null, userInputData)

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: false,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: true,
        },
      ])
    })

    it('should handle empty referrals array', () => {
      const emptySessionDetails: Session = {
        ...mockSessionDetails,
        referrals: [],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, emptySessionDetails)

      const options = presenter.generateAttendeeRadioOptions()

      expect(options).toEqual([])
    })
  })

  describe('errorSummary', () => {
    it('should return null when there is no validation error', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails)

      expect(presenter.errorSummary).toBeNull()
    })

    it('should return error summary when there is a validation error', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendance-who'],
            errorSummaryLinkedField: 'edit-session-attendance-who',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails, validationError)

      expect(presenter.errorSummary).toEqual([
        {
          field: 'edit-session-attendance-who',
          message: 'Select who should attend the session',
        },
      ])
    })
  })

  describe('fields', () => {
    it('should return field with no error message when there is no validation error', () => {
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails)

      expect(presenter.fields).toEqual({
        'edit-session-attendance-who': {
          errorMessage: null,
        },
      })
    })

    it('should return field with error message when there is a validation error', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendance-who'],
            errorSummaryLinkedField: 'edit-session-attendance-who',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendanceWhoPresenter(groupId, backUrl, mockSessionDetails, validationError)

      expect(presenter.fields['edit-session-attendance-who'].errorMessage).toBe('Select who should attend the session')
    })
  })
})
