import { RecordSessionAttendance } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AttendanceSessionNotesPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly recordAttendanceBffData: RecordSessionAttendance | null = null,
    private groupId: string = '',
    private sessionId: string = '',
    private readonly selectedOptionText: string = '',
    private readonly isLastReferral: boolean = false,
    private readonly referralId: string = '',
    private readonly notesValue: string = '',
    private readonly backLink: string = '',
  ) {}

  get lastReferral() {
    return this.isLastReferral
  }

  get hasExistingNotes() {
    return this.notesValue.trim().length > 0
  }

  get showSkipAndAddLater() {
    return !this.hasExistingNotes
  }

  get text() {
    const hintText =
      this.selectedOptionText === 'Attended but failed to comply'
        ? 'Include details of why the person attended but failed to comply.'
        : ''

    return {
      headingCaption: 'Record attendance and progress',
      pageHeading: `${this.personName}: ${this.sessionTitle} session notes`,
      recordsSessionNotesCharacterCount: {
        label: 'Add session notes',
        hint: hintText,
      },
    }
  }

  get sessionTitle() {
    return this.recordAttendanceBffData?.sessionTitle || ''
  }

  get personName() {
    return this.recordAttendanceBffData?.people.find(person => person.referralId === this.referralId)?.name || ''
  }

  get attendanceOptionText() {
    if (this.selectedOptionText === 'Yes - attended') {
      return { attendanceState: '<span class="govuk-tag govuk-tag--blue">Attended</span>' }
    }
    if (this.selectedOptionText === 'Attended but failed to comply') {
      return { attendanceState: '<span class="govuk-tag govuk-tag--yellow">Attended - failed to comply</span>' }
    }
    return { attendanceState: '<span class="govuk-tag govuk-tag--red">Not attended</span>' }
  }

  get backLinkUri() {
    return this.backLink || `/group/${this.groupId}/session/${this.sessionId}/record-attendance`
  }

  get changeAttendanceUri() {
    return `/group/${this.groupId}/session/${this.sessionId}/record-attendance`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      recordSessionAttendanceNotes: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'record-session-attendance-notes'),
        recordsSessionNotesCharacterCount: {
          label: this.text.recordsSessionNotesCharacterCount.label,
        },
        attendanceValue: this.notesValue,
      },
    }
  }
}
