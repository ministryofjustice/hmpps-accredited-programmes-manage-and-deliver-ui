import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { SelectArgsItem } from '../../utils/govukFrontendTypes'

export default class CreateOrEditGroupPduPresenter {
  constructor(
    readonly locations: CodeDescription[],
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupId: string | null = null,
    readonly isEdit = false,
  ) {}

  get backLinkUri() {
    return this.isEdit ? `/group/${this.groupId}/group-details` : `/group/create-a-group/group-sex`
  }

  get text() {
    return {
      headingHintText: this.isEdit
        ? `Edit group ${this.createGroupFormData?.groupCode}`
        : `Create group ${this.createGroupFormData?.groupCode}`,
      headingText: this.isEdit
        ? `Edit the probation delivery unit (PDU) where the group will take place`
        : `In which probation delivery unit (PDU) will the group take place?`,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  generateSelectOptions(): SelectArgsItem[] {
    const pduItems: SelectArgsItem[] = this.locations.map(location => ({
      text: location.description,
      value: `{"code":"${location.code}", "name":"${location.description}"}`,
      selected: this.fields.createGroupPdu.value === location.code,
    }))

    const items: SelectArgsItem[] = [
      {
        text: '',
      },
    ]

    items.push(...pduItems)
    return items
  }

  get fields() {
    return {
      createGroupPdu: {
        value: this.utils.stringValue(this.createGroupFormData.pduCode, 'pduCode'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-pdu'),
      },
    }
  }
}
