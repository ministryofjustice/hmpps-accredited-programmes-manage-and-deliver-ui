import { SessionAttendance } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    readonly groupId: string,
    readonly moduleId: string,
    private readonly groupCode: string,
    private readonly availableSessionAttendanceTemplates: SessionAttendance[],
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSessionAttendanceTemplateId: string | undefined = undefined,
  ) {}

  get text() {
    return { headingHintText: `${this.groupCode}` }
  }

  get backLinkUri() {
    return `/group/${this.groupId}/module/${this.moduleId}/schedule`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      sessionAttendanceTemplate: {
        value: this.selectedSessionAttendanceTemplateId,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-attendance-template'),
      },
    }
  }

  get sessionAttendanceTemplates() {
    return this.availableSessionAttendanceTemplates
  }
}
