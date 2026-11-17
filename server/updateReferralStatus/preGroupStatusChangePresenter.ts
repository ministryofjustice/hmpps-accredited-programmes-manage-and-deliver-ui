import { ReferralDetails } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class PreGroupStatusChangePresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly backLinkUri: string,
    readonly isAddToGroupJourney: boolean = false,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.details.personName}’s referral status will change to On programme`,
      pageHeadingCaption: 'Record attendance and progress',
    }
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      addDetailsTextArea: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-details'),
        value: this.utils.stringValue(null, 'add-details'),
      },
    }
  }

  get pageTitle(): string {
    return 'On programme referral status change - Accredited Programmes'
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.backLinkUri,
    }
  }
}
