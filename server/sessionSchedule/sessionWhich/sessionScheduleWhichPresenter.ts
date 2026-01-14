import { SessionSchedule } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionAttendancePresenter {
  constructor(
    private readonly groupId: string,
    private readonly moduleId: string,
    private readonly groupCode: string,
    private readonly availableSessionAttendanceTemplates: SessionSchedule[],
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSessionAttendanceTemplateId: string | undefined = undefined,
  ) {}

  get text() {
    const firstSessionName = this.availableSessionAttendanceTemplates[0]?.name || 'the session'
    return {
      headingHintText: this.groupCode,
      headingCaptionText: `Schedule a ${firstSessionName}`,
    }
  }

  get backLinkUri() {
    return `/group/${this.groupId}/sessions-and-attendance`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      sessionTemplate: {
        value: this.selectedSessionAttendanceTemplateId,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-template'),
      },
    }
  }

  get sessionTemplates() {
    return this.availableSessionAttendanceTemplates
  }
}
