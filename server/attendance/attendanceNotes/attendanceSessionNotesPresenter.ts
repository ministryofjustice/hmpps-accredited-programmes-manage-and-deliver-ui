import { RecordSessionAttendance, SessionAttendancePerson } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class RecordSessionAttendanceNotesPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly recordAttendanceBffData: RecordSessionAttendance | null = null,
    private groupId: string = '',
    private sessionId: string = '',
    private readonly person: SessionAttendancePerson | null = null,
    private readonly selectedOptionText: string = '',
    private readonly isLastReferral: boolean = false,
  ) {}

  get lastReferral() {
    return this.isLastReferral
  }

  get text() {
    const hintText =
      this.selectedOptionText === 'Attended but failed to comply'
        ? 'Include details of why the person attended but failed to comply.'
        : ''

    return {
      headingCaption: 'Record attendance and progress',
      pageHeading: `${this.person.name}: ${this.sessionTitle} notes`,
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
    return this.person?.name || ''
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
    return `/group/${this.groupId}/session/${this.sessionId}/record-attendance`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      recordSessionAttendanceNotes: {
        attendanceValue: '',
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'record-session-attendance-notes'),
        recordsSessionNotesCharacterCount: {
          label: this.text.recordsSessionNotesCharacterCount.label,
        },
      },
    }
  }
}
