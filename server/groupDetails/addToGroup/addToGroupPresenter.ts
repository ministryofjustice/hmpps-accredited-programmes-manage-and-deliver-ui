import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupPresenter {
  constructor(private readonly validationError: FormValidationError | null = null) {}

  readonly text = {
    pageHeading: `BCCDD1`,
  }

  readonly backLinkHref = '/groupDetails/1234/waitlist'

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      addToGroup: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-to-group'),
      },
    }
  }
}
