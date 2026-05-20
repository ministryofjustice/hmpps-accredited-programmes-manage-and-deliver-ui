import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateOrEditGroupDatePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly groupId: string | null = null,
  ) {}

  get isEditJourney() {
    return Boolean(this.groupId)
  }

  get text() {
    return {
      headingHintText: this.isEditJourney
        ? `Edit group ${this.createGroupFormData.groupCode}`
        : `Create group ${this.createGroupFormData.groupCode}`,
    }
  }

  get backLinkUri() {
    return this.isEditJourney ? `/group/${this.groupId}/group-details` : `/create-group-code`
  }

  get pageTitle() {
    return this.isEditJourney ? `Edit group start date` : `Add group start date`
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
