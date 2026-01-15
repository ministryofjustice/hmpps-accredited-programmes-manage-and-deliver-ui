import { SessionSchedule } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    private readonly groupId: string,
    private readonly moduleId: string,
    private readonly groupCode: string,
    private readonly moduleName: string,
    private readonly availableSessionTemplates: SessionSchedule[],
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSessionTemplateId: string | undefined = undefined,
  ) {}

  get text() {
    const firstSessionName = this.availableSessionTemplates[0]?.name || 'the session'
    const captionParts = [this.groupCode, this.moduleName].filter(Boolean)
    const sessionWhichCaption = captionParts.length ? captionParts.join(' - ') : firstSessionName
    return {
      headingHintText: sessionWhichCaption,
      headingCaptionText: `Schedule a ${firstSessionName}`,
    }
  }

  get backLinkUri() {
    const groupIdentifier = this.groupCode || this.groupId
    return `/group/${encodeURIComponent(groupIdentifier)}/sessions-and-attendance`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      sessionTemplate: {
        value: this.selectedSessionTemplateId,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-template'),
      },
    }
  }

  get sessionTemplates() {
    return this.availableSessionTemplates
  }
}
