import { ReferralDetails, ReferralStatus, ReferralStatusFormData } from '@manage-and-deliver-api'
import { RadiosArgsItem } from '../utils/govukFrontendTypes'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class UpdateReferralStatusPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly statusDetails: ReferralStatusFormData,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    readonly backLinkUri: string,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  generateStatusUpdateCheckboxes() {
    const statusCheckboxes: RadiosArgsItem[] = []
    this.statusDetails.availableStatuses.forEach((status: ReferralStatus) => {
      statusCheckboxes.push({
        value: status.id,
        text: status.status,
        hint: {
          text: status.transitionDescription,
        },
        checked: this.fields.updatedStatus.value.toLowerCase() === status.id.toLowerCase(),
      })
    })
    return statusCheckboxes
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
