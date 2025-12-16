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

  get backLinkArgs() {
    let backUri = this.backLinkUri
    if (this.details.currentStatusDescription === 'Scheduled') {
      backUri = `/referral/${this.details.id}/update-status-scheduled`
    }
    if (this.details.currentStatusDescription === 'On programme') {
      backUri = `/referral/${this.details.id}/update-status-on-programme`
    }
    return {
      text: 'Back',
      href: backUri,
    }
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

  generateAddDetailsHintText() {
    switch (this.statusDetails.currentStatus.title) {
      case 'Awaiting allocation':
        return 'You can add more information about this update, such as the reason for deprioritising someone.'
      case 'Scheduled':
        return 'You can add more information about this update, such as the reason for deprioritising someone.'
      case 'On programme':
        return 'You can add more information about this update, such as the reason why this person cannot continue on the group.'
      default:
        return 'You can add more information about this update, such as the reason for an assessment decision or for deprioritising someone.'
    }
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
