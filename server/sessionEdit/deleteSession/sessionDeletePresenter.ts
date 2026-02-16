import { Session } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class DeleteSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionDetails: Session,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    return {
      pageCaption: this.sessionDetails.pageTitle,
    }
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.backUrl,
    }
  }

  get fields() {
    return {
      delete: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'delete-session'),
      },
    }
  }
}
