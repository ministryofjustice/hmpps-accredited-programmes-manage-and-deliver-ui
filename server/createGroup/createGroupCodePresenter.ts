import { CreateGroup } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupCodePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroup>,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/start`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.createGroupFormData)
  }

  get fields() {
    return {
      createGroupCode: {
        value: this.createGroupFormData.groupCode,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-code'),
      },
    }
  }
}
