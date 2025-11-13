import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupMoreDetailsPresenter {
  constructor(
    private readonly groupId: string,
    private readonly groupManagementData: {
      groupRegion?: string
      personName?: string
      groupCode?: string
    },
    private readonly backLink: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.groupManagementData.personName}'s referral status will change to Scheduled`,
    }
  }

  get backLinkHref() {
    return this.backLink
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      additionalDetails: {
        value: this.utils.stringValue(null, 'additional-details'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'additional-details'),
      },
    }
  }
}
