import PersonalDetails from '../../models/PersonalDetails'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddAvailabilityDatesPresenter {
  constructor(
    private readonly personalDetails: PersonalDetails,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      endDateRequired: {
        value: this.utils.stringValue(null, 'end-date'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'end-date'),
      },
      endDate: {
        value: this.utils.stringValue(null, 'date'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'date'),
      },
    }
  }
}
