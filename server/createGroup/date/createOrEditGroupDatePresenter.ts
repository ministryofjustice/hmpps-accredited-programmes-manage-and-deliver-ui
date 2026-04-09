import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateOrEditGroupDatePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly groupId: string | null = null,
    readonly isEdit = false,
  ) {}

  get text() {
    return {
      headingHintText: this.isEdit
        ? `Edit group ${this.createGroupFormData.groupCode}`
        : `Create group ${this.createGroupFormData.groupCode}`,
    }
  }

  get backLinkUri() {
    return this.isEdit ? `/group/${this.groupId}/group-details` : `/group/create-a-group/create-group-code`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      createGroupDate: {
        value: this.createGroupFormData?.earliestStartDate,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-date'),
      },
    }
  }
}
