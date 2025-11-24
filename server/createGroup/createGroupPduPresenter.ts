import { CodeDescription, CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupPduPresenter {
  constructor(
    readonly locations: CodeDescription[],
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/sex`
  }

  get text() {
    return { headingHintText: `Create group 123` }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
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
