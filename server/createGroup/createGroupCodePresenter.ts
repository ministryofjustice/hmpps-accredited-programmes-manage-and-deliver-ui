import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupCodePresenter {
  constructor(private readonly validationError: FormValidationError | null = null) {}

  get backLinkUri() {
    return `/group/create-a-group/start`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      createGroupCode: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-code'),
      },
    }
  }
}
