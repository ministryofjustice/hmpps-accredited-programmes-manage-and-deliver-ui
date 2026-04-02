import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateOrEditGroupCodePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupId?: string,
    private readonly groupCode?: string,
  ) {}

  private get isEditJourney() {
    return Boolean(this.groupId)
  }

  get backLinkUri() {
    if (this.isEditJourney) {
      return `/group/${this.groupId}/group-details`
    }

    return `/group/create-a-group/create-group`
  }

  get captionText() {
    return this.isEditJourney ? `Edit group ${this.groupCode}` : 'Create a group'
  }

  get pageTitle() {
    return this.isEditJourney ? `Edit group code` : 'Create a group code'
  }

  get submitButtonText() {
    return this.isEditJourney ? 'Submit' : 'Continue'
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
