import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class RemoveFromGroupPresenter {
  constructor(
    readonly groupId: string,
    private readonly groupManagementData: {
      groupRegion?: string
      personName?: string
    },
    private readonly backLink: string,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: this.groupManagementData.groupRegion,
      questionText: `Remove ${this.groupManagementData.personName} from this group?`,
    }
  }

  get backLinkHref() {
    return this.backLink
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      removeFromGroup: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'remove-from-group'),
        value: this.utils.stringValue(null, 'remove-from-group'),
      },
    }
  }
}
