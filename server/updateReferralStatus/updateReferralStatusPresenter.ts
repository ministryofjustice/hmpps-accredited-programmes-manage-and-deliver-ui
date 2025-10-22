import { ReferralDetails, ReferralStatus, ReferralStatusFormData } from '@manage-and-deliver-api'
import { RadiosArgsItem } from '../utils/govukFrontendTypes'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class UpdateReferralStatusPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly statusDetails: ReferralStatusFormData,
    readonly backLinkUri: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  generateStatusUpdateRadios() {
    const statusRadios: RadiosArgsItem[] = []
    this.statusDetails.availableStatuses.forEach((status: ReferralStatus) => {
      statusRadios.push({
        value: status.id,
        text: status.status,
        hint: {
          text: status.transitionDescription,
        },
        checked: this.fields.updatedStatus.value.toLowerCase() === status.id.toLowerCase(),
      })
    })
    return statusRadios
  }

  get fields() {
    return {
      moreDetailsTextArea: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'more-details'),
        value: this.utils.stringValue(null, 'more-details'),
      },
      updatedStatus: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'updated-status'),
        value: this.utils.stringValue(null, 'updated-status'),
      },
    }
  }
}
