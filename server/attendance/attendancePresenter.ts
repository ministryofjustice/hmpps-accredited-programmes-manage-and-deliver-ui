import { RecordSessionAttendance } from '@manage-and-deliver-api'
import PresenterUtils from '../utils/presenterUtils'
import { FormValidationError } from '../utils/formValidationError'

export default class AttendancePresenter {
  constructor(
    readonly recordAttendanceBffData: RecordSessionAttendance,
    readonly backLinkUri: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading:
        this.recordAttendanceBffData.people.length === 1
          ? `Did ${this.recordAttendanceBffData.people[0].name} attend ${this.recordAttendanceBffData.sessionTitle}?`
          : `Record attendance for ${this.recordAttendanceBffData.sessionTitle}?`,
      headingCaption: `Record attendance and progress`,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    const fields: Record<string, { value: string | null; errorMessage: string | null }> = {}

    this.recordAttendanceBffData.people.forEach(person => {
      const fieldName = `attendance-${person.referralId}`
      fields[fieldName] = {
        value: this.utils.stringValue(null, fieldName),
        errorMessage: PresenterUtils.errorMessage(this.validationError, fieldName),
      }
    })

    return fields
  }

  private get utils() {
    return new PresenterUtils()
  }
}
