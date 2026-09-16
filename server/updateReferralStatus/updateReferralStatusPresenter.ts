import { ReferralDetails, ReferralStatus, ReferralStatusTransitions } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import { RadiosArgsItem } from '../utils/govukFrontendTypes'
import PresenterUtils from '../utils/presenterUtils'

export default class UpdateReferralStatusPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly statusDetails: ReferralStatusTransitions,
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

  get pageTitle(): string {
    return 'Update status'
  }

  get backLinkArgs() {
    let backUri = this.backLinkUri
    if (this.statusDetails.currentStatus.title === 'Scheduled') {
      backUri = `/referral/${this.details.id}/update-status-scheduled?startedOrCompleted=false`
    }
    if (this.statusDetails.currentStatus.title === 'On programme') {
      backUri = `/referral/${this.details.id}/update-status-on-programme?startedOrCompleted=false`
    }
    return {
      text: 'Back',
      href: backUri,
    }
  }

  generateStatusUpdateRadios() {
    const statusRadios: RadiosArgsItem[] = []
    this.statusDetails.availableStatuses.forEach((status: ReferralStatus) => {
      if (status.status !== 'Deprioritised') {
        statusRadios.push({
          value: status.id,
          text: status.status,
          hint: {
            text: status.transitionDescription,
          },
          checked: this.fields.updatedStatus.value.toLowerCase() === status.id.toLowerCase(),
        })
      }
    })
    return statusRadios
  }

  showTopInsetText() {
    return ['Awaiting allocation'].includes(this.statusDetails.currentStatus.title)
  }

  showBottomInsetText() {
    return ['Scheduled', 'On programme'].includes(this.statusDetails.currentStatus.title)
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
