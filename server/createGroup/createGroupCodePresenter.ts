import { FormValidationError } from '../utils/formValidationError'
import Pagination from '../utils/pagination/pagination'
import PresenterUtils from '../utils/presenterUtils'

export default class CreateGroupCodePresenter {
  public readonly pagination: Pagination

  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get backLinkUri() {
    return `/group/create-a-group/start`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get errorMessage() {
    return PresenterUtils.errorMessage(this.validationError, 'createGroupCode')
  }
}
