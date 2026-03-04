import recordSessionAttendanceFactory from '../../testutils/factories/recordSessionAttendanceFactory'
import AttendanceSessionNotesPresenter from './attendanceSessionNotesPresenter'
import { FormValidationError } from '../../utils/formValidationError'

describe('AttendanceSessionNotesPresenter', () => {
  const buildPresenter = ({
    selectedAttendanceCode,
    notesValue = '',
    backLink = '/back-link',
    isLastReferral = false,
    validationError = null,
    referralId,
    useNullBffData = false,
  }: {
    selectedAttendanceCode?: string
    notesValue?: string
    backLink?: string
    isLastReferral?: boolean
    validationError?: FormValidationError | null
    referralId?: string
    useNullBffData?: boolean
  } = {}) => {
    const bffData = recordSessionAttendanceFactory.build()
    const selectedReferralId = referralId ?? bffData.people[0].referralId

    return new AttendanceSessionNotesPresenter(
      validationError,
      useNullBffData ? null : bffData,
      'group-1',
      'session-1',
      selectedAttendanceCode,
      isLastReferral,
      selectedReferralId,
      notesValue,
      backLink,
    )
  }

  describe('lastReferral', () => {
    it('returns true when the current referral is last', () => {
      const presenter = buildPresenter({ isLastReferral: true })

      expect(presenter.lastReferral).toBe(true)
    })
  })

  describe('hasExistingNotes and showSkipAndAddLater', () => {
    it('treats whitespace-only notes as empty', () => {
      const presenter = buildPresenter({ notesValue: '   ' })

      expect(presenter.hasExistingNotes).toBe(false)
      expect(presenter.showSkipAndAddLater).toBe(true)
    })

    it('returns hasExistingNotes true and hides skip button when notes are present', () => {
      const presenter = buildPresenter({ notesValue: 'Some notes' })

      expect(presenter.hasExistingNotes).toBe(true)
      expect(presenter.showSkipAndAddLater).toBe(false)
    })
  })

  describe('attendanceOptionText', () => {
    it('returns attended tag for ATTC', () => {
      const presenter = buildPresenter({ selectedAttendanceCode: 'ATTC' })

      expect(presenter.attendanceOptionText).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>',
      })
    })

    it('returns attended failed to comply tag for AFTC', () => {
      const presenter = buildPresenter({ selectedAttendanceCode: 'AFTC' })

      expect(presenter.attendanceOptionText).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>',
      })
    })

    it('returns not attended tag for unrecognised code', () => {
      const presenter = buildPresenter({ selectedAttendanceCode: 'UAAB' })

      expect(presenter.attendanceOptionText).toEqual({
        attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>',
      })
    })
  })

  describe('text.recordsSessionNotesCharacterCount.hint', () => {
    it('returns failed-to-comply hint for AFTC', () => {
      const presenter = buildPresenter({ selectedAttendanceCode: 'AFTC' })

      expect(presenter.text.recordsSessionNotesCharacterCount.hint).toBe(
        'Include details of why the person attended but failed to comply.',
      )
    })

    it('returns empty hint for non-AFTC code', () => {
      const presenter = buildPresenter({ selectedAttendanceCode: 'ATTC' })

      expect(presenter.text.recordsSessionNotesCharacterCount.hint).toBe('')
    })
  })

  describe('text.pageHeading', () => {
    it('builds heading from person name and session title', () => {
      const presenter = buildPresenter()

      expect(presenter.text.pageHeading).toContain(':')
      expect(presenter.text.pageHeading).toContain('session notes')
    })

    it('gracefully handles null bff data', () => {
      const presenter = buildPresenter({ useNullBffData: true })

      expect(presenter.sessionTitle).toBe('')
      expect(presenter.personName).toBe('')
      expect(presenter.text.pageHeading).toBe(':  session notes')
    })

    it('returns empty personName when referralId does not exist in people', () => {
      const presenter = buildPresenter({ referralId: 'missing-referral-id' })

      expect(presenter.personName).toBe('')
    })
  })

  describe('backLinkUri and changeAttendanceUri', () => {
    it('uses provided backlink when present', () => {
      const presenter = buildPresenter({ backLink: '/custom-back-link' })

      expect(presenter.backLinkUri).toBe('/custom-back-link')
    })

    it('falls back to record attendance path when backlink is empty', () => {
      const presenter = buildPresenter({ backLink: '' })

      expect(presenter.backLinkUri).toBe('/group/group-1/session/session-1/record-attendance')
      expect(presenter.changeAttendanceUri).toBe('/group/group-1/session/session-1/record-attendance')
    })
  })

  describe('validation and fields', () => {
    it('returns null error summary when there is no validation error', () => {
      const presenter = buildPresenter()

      expect(presenter.errorSummary).toBeNull()
    })

    it('surfaces validation error in errorSummary and fields', () => {
      const validationError: FormValidationError = {
        errors: [
          {
            formFields: ['record-session-attendance-notes'],
            errorSummaryLinkedField: 'record-session-attendance-notes',
            message: 'Enter session notes',
          },
        ],
      }

      const presenter = buildPresenter({ validationError, notesValue: 'Saved note text' })

      expect(presenter.errorSummary).toEqual([
        {
          field: 'record-session-attendance-notes',
          message: 'Enter session notes',
        },
      ])
      expect(presenter.fields.recordSessionAttendanceNotes.errorMessage).toBe('Enter session notes')
      expect(presenter.fields.recordSessionAttendanceNotes.attendanceValue).toBe('Saved note text')
    })
  })
})
