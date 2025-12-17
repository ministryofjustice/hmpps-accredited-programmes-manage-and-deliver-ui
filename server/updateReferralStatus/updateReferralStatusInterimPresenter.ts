import { ReferralDetails } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class UpdateReferralStatusInterimPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly backLinkUri: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly startedOrCompleted: string | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get text() {
    return {
      title:
        this.details.currentStatusDescription === 'Scheduled'
          ? `${this.details.personName} is allocated to a group`
          : `${this.details.personName} has started Building Choices`,
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
