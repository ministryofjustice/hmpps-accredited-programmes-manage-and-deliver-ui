import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupPresenter {
  constructor(
    readonly groupId: string,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  readonly text = {
    pageHeading: `BCCDD1`,
  }

  get backLinkHref() {
    return `/groupDetails/${this.groupId}/waitlist`
  }

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
