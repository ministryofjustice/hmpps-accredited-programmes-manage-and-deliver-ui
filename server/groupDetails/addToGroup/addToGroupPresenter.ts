import { Session, SessionData } from 'express-session'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupPresenter {
  constructor(
    readonly groupId: string,
    private readonly session: Session & Partial<SessionData>,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get text() {
    return {
      pageHeading: this.session.groupManagementData.groupRegion,
      questionText: `Add ${this.session.groupManagementData.personName} to this group?`,
    }
  }

  get backLinkHref() {
    return `/groupDetails/${this.groupId}/waitlist`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    return {
      addToGroup: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-to-group'),
      },
    }
  }
}
