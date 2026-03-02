import { ScheduleSessionTypeResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    private readonly groupId: string,
    private readonly scheduleSessionTypeResponse: ScheduleSessionTypeResponse,
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSession: string | undefined = undefined,
  ) {}

  get text() {
    return { headingHintText: this.scheduleSessionTypeResponse.pageHeading }
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
        value: this.selectedSession,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-template'),
      },
    }
  }

  get sessionTemplates() {
    return this.scheduleSessionTypeResponse.sessionTemplates
  }
}
