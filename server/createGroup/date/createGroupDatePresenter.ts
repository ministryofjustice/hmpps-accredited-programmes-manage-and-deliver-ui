import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class CreateGroupDatePresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
    private readonly bankHolidays: string[] = [],
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/create-group-code`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.createGroupFormData)
  }

  get fields() {
    return {
      createGroupDate: {
        value: this.createGroupFormData?.earliestStartDate,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-date'),
      },
    }
  }

  get excludedDates(): string {
    return this.bankHolidays
      .map(date => {
        const [year, month, day] = date.split('-')
        return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`
      })
      .join(' ')
  }
}
