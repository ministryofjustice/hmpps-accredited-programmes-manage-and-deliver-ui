import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

export default class CreateGroupLocationPresenter {
  constructor(
    readonly locations: CodeDescription[],
    private readonly validationError: FormValidationError | null = null,
    readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/group-probation-delivery-unit`
  }

  get text() {
    return {
      headingHintText: `Create group ${this.createGroupFormData?.groupCode}`,
      subHeadingText: 'Where will the group take place?',
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
