import { CreateGroup } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupCohortPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroup>,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/code`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      createGroupCohort: {
        value: this.createGroupFormData.cohort,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-cohort'),
      },
    }
  }
}
