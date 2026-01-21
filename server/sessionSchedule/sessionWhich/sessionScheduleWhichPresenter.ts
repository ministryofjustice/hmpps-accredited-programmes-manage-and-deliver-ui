import { ModuleSessionTemplate } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    private readonly groupId: string,
    private readonly moduleId: string,
    private readonly sessionName: string,
    private readonly availableSessionTemplates: ModuleSessionTemplate[],
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedSessionTemplateId: string | undefined = undefined,
  ) {}

  get text() {
    return { headingHintText: `Schedule a ${this.sessionName}` } // {# TODO Look at updatingthis #}
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
        value: this.selectedSessionTemplateId,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-template'),
      },
    }
  }

  get sessionTemplates() {
    return this.availableSessionTemplates
  }
}
