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

  get selectedSessionTemplateId(): string | undefined {
    return this.selectedSession?.split('+')[0]
  }

  get sessionTemplates() {
    const templates = new Map<
      string,
      (typeof this.scheduleSessionTypeResponse.sessionTemplates)[number] & {
        sessionScheduleTypes: string[]
      }
    >()

    this.scheduleSessionTypeResponse.sessionTemplates.forEach(template => {
      const existingTemplate = templates.get(template.id)
      if (existingTemplate) {
        existingTemplate.sessionScheduleTypes.push(template.sessionScheduleType)
      } else {
        templates.set(template.id, { ...template, sessionScheduleTypes: [template.sessionScheduleType] })
      }
    })

    return Array.from(templates.values()).map(template => {
      const sessionScheduleTypes = [...new Set(template.sessionScheduleTypes)]
      if (sessionScheduleTypes.includes('SCHEDULED') && !sessionScheduleTypes.includes('CATCH_UP')) {
        sessionScheduleTypes.push('CATCH_UP')
      }

      return { ...template, sessionScheduleTypes }
    })
  }
}
