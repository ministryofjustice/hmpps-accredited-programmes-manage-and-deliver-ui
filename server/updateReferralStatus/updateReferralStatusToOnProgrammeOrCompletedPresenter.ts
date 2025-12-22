import { ReferralDetails } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class UpdateReferralStatusFixedPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly backLinkUri: string,
    readonly cancelUri: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get text() {
    return {
      title:
        this.details.currentStatusDescription === 'Scheduled'
          ? `${this.details.personName}'s referral status will change to On programme`
          : `${this.details.personName}'s referral status will change to Programme complete`,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      moreDetailsTextArea: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'more-details'),
        value: this.utils.stringValue(null, 'more-details'),
      },
    }
  }
}
