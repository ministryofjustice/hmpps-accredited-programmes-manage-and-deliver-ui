import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupPresenter {
  constructor(
    readonly groupId: string,
    private readonly groupManagementData: {
      groupCode?: string
      groupRegion?: string
      personName?: string
    },
    private readonly backLink: string,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    return {
      pageHeading: this.groupManagementData.groupCode,
      questionText: `Add ${this.groupManagementData.personName} to this group?`,
    }
  }

  get backLinkHref() {
    return this.backLink
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      addToGroup: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-to-group'),
      },
    }
  }
}
