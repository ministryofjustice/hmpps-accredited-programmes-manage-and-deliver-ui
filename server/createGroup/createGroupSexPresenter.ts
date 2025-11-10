import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupSexPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/cohort`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      createGroupSex: {
        value: this.createGroupFormData.sex,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-sex'),
      },
    }
  }
}
