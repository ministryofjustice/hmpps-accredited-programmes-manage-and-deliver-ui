import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class ForceStatusLookupPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get pageTitle(): string {
    return 'Force-update referral status'
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      referralId: {
        value: this.utils.stringValue(null, 'referral-id'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'referral-id'),
      },
    }
  }
}
