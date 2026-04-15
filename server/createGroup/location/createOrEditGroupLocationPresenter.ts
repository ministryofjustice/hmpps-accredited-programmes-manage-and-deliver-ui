import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

export default class CreateOrEditGroupLocationPresenter {
  constructor(
    readonly locations: CodeDescription[],
    private readonly validationError: FormValidationError | null = null,
    readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupId: string | null = null,
    readonly isEdit = false,
    private readonly backLink: string | null = null,
  ) {}

  get backLinkUri() {
    return this.isEdit ? `${this.backLink}` : `/group/create-a-group/group-probation-delivery-unit`
  }

  get changeLinkUri() {
    return this.isEdit
      ? `/group/${this.groupId}/edit-group-probation-delivery-unit`
      : `/group/create-a-group/group-probation-delivery-unit`
  }

  get text() {
    return {
      headingHintText: this.isEdit
        ? `Edit group ${this.createGroupFormData?.groupCode}`
        : `Create group ${this.createGroupFormData?.groupCode}`,
      subHeadingText: this.isEdit ? `Edit where the group will take place` : 'Where will the group take place?',
      buttonText: this.isEdit ? 'Submit' : 'Continue',
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  generateRadioOptions(): RadiosArgsItem[] {
    return this.locations.map(location => ({
      text: location.description,
      value: `{"code":"${location.code}", "name":"${location.description}"}`,
      checked: this.fields.createGroupLocation.value === location.code,
    }))
  }

  get fields() {
    return {
      createGroupLocation: {
        value: this.utils.stringValue(this.createGroupFormData.deliveryLocationCode, 'deliveryLocationCode'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-location'),
      },
    }
  }
}
