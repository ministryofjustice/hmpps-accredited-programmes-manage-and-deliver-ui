import { ReferralStatus, ReferralStatusTransitions } from '@manage-and-deliver-api'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'
import { FormValidationError } from '../../utils/formValidationError'
import ViewUtils from '../../utils/viewUtils'

export default class RemoveFromGroupUpdateStatusPresenter {
  constructor(
    readonly statusDetails: ReferralStatusTransitions,
    readonly backLinkUri: string,
    private readonly groupManagementData: {
      groupRegion?: string
      personName?: string
    },
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `Update ${this.groupManagementData.personName}'s referral status`,
    }
  }

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

  generateMoreDetailsTextBox() {
    return {
      name: 'additional-details',
      id: 'additional-details',
      label: {
        text: 'Add details (optional)',
        classes: 'govuk-label--m',
        isPageHeading: false,
      },
      maxlength: '500',
      hint: {
        text:
          this.statusDetails.currentStatus.title === 'Scheduled'
            ? 'You can add more information about this update, such as the reason for an assessment decision or for deprioritising someone.'
            : 'You can add more information about this update, such as the reason why the person cannot continue on the group',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.fields.moreDetailsTextArea.errorMessage),
      value: this.fields.moreDetailsTextArea.value,
    }
  }

  get fields() {
    return {
      moreDetailsTextArea: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'additional-details'),
        value: this.utils.stringValue(null, 'additional-details'),
      },
      updatedStatus: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'updated-status'),
        value: this.utils.stringValue(null, 'updated-status'),
      },
    }
  }
}
