import { RecordSessionAttendance } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import attendanceOptionText, { attendanceOptionTextTags } from '../../utils/attendanceUtils'

export default class AttendanceSessionNotesPresenter {
  constructor(
    private readonly validationError: FormValidationError | null,
    private readonly recordAttendanceBffData: RecordSessionAttendance | null,
    private readonly groupId: string,
    private readonly sessionId: string,
    private readonly selectedAttendanceCode: string | undefined,
    private readonly isLastReferral: boolean,
    private readonly referralId: string,
    private readonly notesValue: string,
    private readonly backLink: string,
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

  get isCatchup(): boolean {
    return this.recordAttendanceBffData?.isCatchup ?? false
  }

  get text() {
    const hintText =
      this.selectedAttendanceCode === 'AFTC' ? 'Include details of why the person attended but failed to comply.' : ''

    return {
      headingCaption: 'Record attendance and progress',
      pageHeading: this.isCatchup
        ? `${this.personName}: ${this.sessionTitle} catch-up session notes`
        : `${this.personName}: ${this.sessionTitle} session notes`,
      recordsSessionNotesCharacterCount: {
        label: 'Add session notes',
        hint: hintText,
      },
    }
  }

  get pageTitle(): string {
    return `Add ${this.sessionTitle} session notes`
  }

  get sessionTitle() {
    return this.recordAttendanceBffData?.sessionModule || ''
  }

  get personName() {
    return this.recordAttendanceBffData?.people.find(person => person.referralId === this.referralId)?.name || ''
  }

  get attendanceOptionText() {
    return attendanceOptionText(this.selectedAttendanceCode, attendanceOptionTextTags.attendanceSessionNotes)
  }

  get backLinkUri() {
    return this.backLink || `/${this.groupId}/${this.sessionId}/record-attendance`
  }

  get changeAttendanceUri() {
    return `/${this.groupId}/${this.sessionId}/record-attendance`
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
