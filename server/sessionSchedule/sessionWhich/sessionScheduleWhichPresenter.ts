import { ScheduleSessionTypeResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    private readonly groupId: string,
    private readonly scheduleSessionTypeResponse: ScheduleSessionTypeResponse,
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSession: string | undefined = undefined,
    private readonly selectedSessionScheduleType: string | undefined = undefined,
  ) {}

  get pageTitle(): string {
    return 'Which session are you scheduling?'
  }

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
      sessionScheduleType: {
        value: this.selectedSessionScheduleType,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-schedule-type'),
      },
    }
  }

  get sessionTemplates() {
    return this.scheduleSessionTypeResponse.sessionTemplates.filter(
      template => template.sessionScheduleType === 'SCHEDULED',
    )
  }
}
