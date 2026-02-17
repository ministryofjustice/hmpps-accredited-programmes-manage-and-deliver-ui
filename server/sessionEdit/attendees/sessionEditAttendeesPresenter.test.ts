import { EditSessionAttendeesResponse } from '@manage-and-deliver-api'
import EditSessionAttendeesPresenter from './sessionEditAttendeesPresenter'
import { FormValidationError } from '../../utils/formValidationError'

const buildSessionAttendees = (
  overrides: Partial<EditSessionAttendeesResponse> = {},
): EditSessionAttendeesResponse => ({
  sessionId: 'session-123',
  sessionName: 'Getting started',
  sessionType: 'ONE_TO_ONE',
  isCatchup: false,
  attendees: [
    {
      name: 'John Doe',
      referralId: 'referral-1',
      crn: 'X123456',
      currentlyAttending: true,
    },
    {
      name: 'Jane Smith',
      referralId: 'referral-2',
      crn: 'Y654321',
      currentlyAttending: false,
    },
  ],
  ...overrides,
})

describe('EditSessionAttendeesPresenter', () => {
  const groupId = 'group-123'
  const backUrl = '/back-url'

  describe('text', () => {
    it('returns page heading for session', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.text).toEqual({
        headingText: 'Edit who should attend the session',
        pageHeading: 'Getting started',
      })
    })
  })

  describe('backLinkArgs', () => {
    it('returns correct back link args', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.backLinkArgs).toEqual({
        text: 'Back',
        href: backUrl,
      })
    })
  })

  describe('generateAttendeeRadioOptions', () => {
    it('pre-selects the currently attending attendee', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.generateAttendeeRadioOptions()).toEqual([
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

    it('returns empty options when no attendees exist', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees({ attendees: [] }))

      expect(presenter.generateAttendeeRadioOptions()).toEqual([])
    })

    it('pre-selects multiple attendees if multiple have currentlyAttending true', () => {
      const presenter = new EditSessionAttendeesPresenter(
        groupId,
        backUrl,
        buildSessionAttendees({
          attendees: [
            {
              name: 'John Doe',
              referralId: 'referral-1',
              crn: 'X123456',
              currentlyAttending: true,
            },
            {
              name: 'Jane Smith',
              referralId: 'referral-2',
              crn: 'Y654321',
              currentlyAttending: true,
            },
          ],
        }),
      )

      expect(presenter.generateAttendeeRadioOptions()).toEqual([
        {
          text: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
        },
        {
          text: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: true,
        },
      ])
    })
  })

  describe('errorSummary', () => {
    it('returns null when no validation error', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.errorSummary).toBeNull()
    })

    it('returns error summary for validation errors', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendees'],
            errorSummaryLinkedField: 'edit-session-attendees',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees(), validationError)

      expect(presenter.errorSummary).toEqual([
        {
          field: 'edit-session-attendees',
          message: 'Select who should attend the session',
        },
      ])
    })
  })

  describe('fields', () => {
    it('returns null error message when no validation error', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.fields).toEqual({
        'edit-session-attendees': {
          errorMessage: null,
        },
      })
    })

    it('returns error message for validation errors', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['edit-session-attendees'],
            errorSummaryLinkedField: 'edit-session-attendees',
            message: 'Select who should attend the session',
          },
        ],
      }
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees(), validationError)

      expect(presenter.fields['edit-session-attendees'].errorMessage).toBe('Select who should attend the session')
    })
  })
})
