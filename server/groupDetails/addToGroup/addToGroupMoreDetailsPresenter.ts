import { Session, SessionData } from 'express-session'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

export default class AddToGroupMoreDetailsPresenter {
  constructor(
    private readonly groupId: string,
    private readonly session: Session & Partial<SessionData>,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.session.groupManagementData.personName}'s referral status will change to Scheduled`,
    }
  }

  get backLinkHref() {
    return `/groupDetails/${this.groupId}/waitlist`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    return {
      addDetails: {
        value: this.utils.stringValue(null, 'add-details'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'add-details'),
      },
    }
  }
}
