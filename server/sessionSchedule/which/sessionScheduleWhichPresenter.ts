import { ModuleSessionTemplate } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class SessionScheduleWhichPresenter {
  constructor(
    private readonly sessionTemplatesData: ModuleSessionTemplate[],
    private readonly validationError: FormValidationError | null = null,
    private readonly selectedTemplateId: string | undefined = undefined,
  ) {}

  get backLinkUri() {
    return `/group/sessions`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      sessionTemplate: {
        value: this.selectedTemplateId,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'session-template'),
      },
    }
  }

  get sessionTemplates() {
    return this.sessionTemplatesData
  }
}
