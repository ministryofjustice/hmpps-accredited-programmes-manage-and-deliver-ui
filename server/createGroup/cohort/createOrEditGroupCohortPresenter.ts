import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateOrEditGroupCohortPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupId?: string,
    private readonly cohort?: string,
  ) {}

  private get isEditJourney() {
    return Boolean(this.groupId)
  }

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData?.cohort}` }
  }

  get backLinkUri() {
    return this.isEditJourney ? `/group/${this.groupId}/group-details` : '/group/create-a-group/group-days-and-times'
  }

  get captionText() {
    return this.isEditJourney ? `Edit group ${this.cohort}` : 'Create a group'
  }

  get pageTitle() {
    return this.isEditJourney ? `Èdit group cohort` : `Create group cohort`
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
      createOrEditGroupCohort: {
        value: this.utils.stringValue(this.createGroupFormData?.cohort, 'create-group-cohort'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-cohort'),
      },
    }
  }
}
