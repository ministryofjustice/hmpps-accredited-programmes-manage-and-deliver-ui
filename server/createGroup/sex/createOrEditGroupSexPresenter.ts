import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateOrEditGroupSexPresenter {
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
    return this.isEditJourney ? `/group/${this.groupId}/group-details` : '/group/create-a-group/group-cohort'
  }

  get captionText() {
    return this.isEditJourney ? `Edit group ${this.groupCode}` : 'Create a group'
  }

  get pageTitle() {
    return this.isEditJourney ? `Edit the gender of the group` : `Select the gender of the group`
  }

  get submitButtonText() {
    return this.isEditJourney ? `Submit` : `Continue`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      createOrEditGroupSex: {
        value: this.utils.stringValue(this.createGroupFormData?.sex, 'create-group-sex'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-sex'),
      },
    }
  }
}
