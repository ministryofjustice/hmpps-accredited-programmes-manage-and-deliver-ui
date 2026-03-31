import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateGroupCodePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupId?: string,
    private readonly groupCode?: string,
  ) {}

  get backLinkUri() {
    if (this.groupId) {
      return `/group/${this.groupId}/group-details`
    }

    return `/group/create-a-group/create-group`
  }

  get captionText() {
    return this.groupId ? `Edit group ${this.groupCode}` : 'Create a group'
  }

  get pageTitle() {
    return this.groupId ? `Edit group code` : 'Create a group code'
  }

  get submitButtonText() {
    return this.groupId ? 'Submit' : 'Continue'
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      createGroupCode: {
        value: this.utils.stringValue(this.createGroupFormData?.groupCode, 'create-group-code'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-code'),
      },
    }
  }
}
