import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupCohortPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly groupCode: string | null = null,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/code`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      createGroupCohort: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-cohort'),
      },
    }
  }
}
