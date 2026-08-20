import { EditSessionAttendeesResponse } from '@manage-and-deliver-api'
import EditSessionAttendeesPresenter from './editSessionAttendeesPresenter'
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
      isExcluded: false,
    },
    {
      name: 'Jane Smith',
      referralId: 'referral-2',
      crn: 'Y654321',
      currentlyAttending: false,
      isExcluded: false,
    },
  ],
  ...overrides,
})

const restrictedBadge = (crn: string): string =>
  `${crn}<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span><p>You cannot add a restricted participant to the session.</p>`

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
          html: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
          disabled: false,
        },
        {
          html: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: false,
          disabled: false,
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
              isExcluded: false,
            },
            {
              name: 'Jane Smith',
              referralId: 'referral-2',
              crn: 'Y654321',
              currentlyAttending: true,
              isExcluded: false,
            },
          ],
        }),
      )

      expect(presenter.generateAttendeeRadioOptions()).toEqual([
        {
          html: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
          disabled: false,
        },
        {
          html: 'Jane Smith (Y654321)',
          value: 'referral-2',
          checked: true,
          disabled: false,
        },
      ])
    })

    it('marks an excluded attendee as disabled, shows the restricted access badge, and sorts them last', () => {
      const presenter = new EditSessionAttendeesPresenter(
        groupId,
        backUrl,
        buildSessionAttendees({
          attendees: [
            {
              name: 'Jane Smith',
              referralId: 'referral-2',
              crn: 'Y654321',
              currentlyAttending: false,
              isExcluded: true,
            },
            {
              name: 'John Doe',
              referralId: 'referral-1',
              crn: 'X123456',
              currentlyAttending: true,
              isExcluded: false,
            },
          ],
        }),
      )

      expect(presenter.generateAttendeeRadioOptions()).toEqual([
        {
          html: 'John Doe (X123456)',
          value: 'referral-1',
          checked: true,
          disabled: false,
        },
        {
          html: restrictedBadge('Y654321'),
          value: 'referral-2',
          checked: false,
          disabled: true,
        },
      ])
    })
  })

  describe('generateAttendeeCheckboxOptions', () => {
    it('pre-selects the currently attending attendee', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.generateAttendeeCheckboxOptions()).toEqual([
        {
          html: 'John Doe (X123456)',
          value: 'referral-1 + John Doe',
          checked: true,
          disabled: false,
        },
        {
          html: 'Jane Smith (Y654321)',
          value: 'referral-2 + Jane Smith',
          checked: false,
          disabled: false,
        },
      ])
    })

    it('returns empty options when no attendees exist', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees({ attendees: [] }))

      expect(presenter.generateAttendeeCheckboxOptions()).toEqual([])
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
              isExcluded: false,
            },
            {
              name: 'Jane Smith',
              referralId: 'referral-2',
              crn: 'Y654321',
              currentlyAttending: true,
              isExcluded: false,
            },
          ],
        }),
      )

      expect(presenter.generateAttendeeCheckboxOptions()).toEqual([
        {
          html: 'John Doe (X123456)',
          value: 'referral-1 + John Doe',
          checked: true,
          disabled: false,
        },
        {
          html: 'Jane Smith (Y654321)',
          value: 'referral-2 + Jane Smith',
          checked: true,
          disabled: false,
        },
      ])
    })

    it('marks an excluded attendee as disabled, shows the restricted access badge, and sorts them last', () => {
      const presenter = new EditSessionAttendeesPresenter(
        groupId,
        backUrl,
        buildSessionAttendees({
          attendees: [
            {
              name: 'Jane Smith',
              referralId: 'referral-2',
              crn: 'Y654321',
              currentlyAttending: false,
              isExcluded: true,
            },
            {
              name: 'John Doe',
              referralId: 'referral-1',
              crn: 'X123456',
              currentlyAttending: true,
              isExcluded: false,
            },
          ],
        }),
      )

      expect(presenter.generateAttendeeCheckboxOptions()).toEqual([
        {
          html: 'John Doe (X123456)',
          value: 'referral-1 + John Doe',
          checked: true,
          disabled: false,
        },
        {
          html: restrictedBadge('Y654321'),
          value: `referral-2 + Y654321`,
          checked: false,
          disabled: true,
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

  describe('pageTitle', () => {
    it('returns the correct page title', () => {
      const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, buildSessionAttendees())

      expect(presenter.pageTitle).toBe('Edit who should attend the session')
    })
  })
})
