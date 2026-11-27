import { ReferralDetails, ReferralStatusTransitions } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { formatPersonName } from '../utils/utils'

export default class UpdateReferralStatusStartedOrCompletedPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly statusDetails: ReferralStatusTransitions,
    readonly backLinkUri: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly startedOrCompleted: string | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get pageTitle(): string {
    return 'Update status'
  }

  get text() {
    return {
      title:
        this.statusDetails.currentStatus.title === 'Scheduled'
          ? `${formatPersonName(this.details.personName)} is allocated to a group`
          : `${formatPersonName(this.details.personName)} has started Building Choices`,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      currentStatus: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'started-or-completed'),
        value: this.utils.stringValue(this.startedOrCompleted, 'startedOrCompleted'),
      },
    }
  }
}
