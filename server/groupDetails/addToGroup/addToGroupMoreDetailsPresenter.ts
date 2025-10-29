import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupMoreDetailsPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  readonly text = {
    pageHeading: `Alex River's referral status will change to Scheduled`,
  }

  readonly backLinkHref = '/groupDetails/1234/waitlist'

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      addDetails: {
        value: this.utils.stringValue(null, 'add-details'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-details'),
      },
    }
  }
}
