import { ForceStatusFormData, ReferralStatus } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'
import PresenterUtils from '../../utils/presenterUtils'

export default class ForceStatusPresenter {
  constructor(
    readonly formData: ForceStatusFormData,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    readonly successMessage: string | null = null,
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
      newStatus: {
        value: this.utils.stringValue(null, 'new-status'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'new-status'),
      },
      moreDetails: {
        value: this.utils.stringValue(null, 'more-details'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'more-details'),
      },
    }
  }

  generateStatusRadios(): RadiosArgsItem[] {
    return this.formData.availableStatuses.map((status: ReferralStatus) => ({
      value: status.id,
      text: status.status,
      checked: this.fields.newStatus.value.toLowerCase() === status.id.toLowerCase(),
    }))
  }
}
