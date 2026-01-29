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
      pageCaption: this.generatePageCaption(),
    }
  }

  generatePageCaption() {
    switch (this.sessionDetails.type) {
      case 'Individual':
        if (this.sessionDetails.name === 'Post programme review') {
          return `Delete ${this.sessionDetails.referrals[0].personName}: Post-programme review`
        }
        if (this.sessionDetails.isCatchup) {
          return `Delete ${this.sessionDetails.referrals[0].personName}: ${this.sessionDetails.name} one-to-one catch-up`
        }
        return `Delete ${this.sessionDetails.referrals[0].personName}: ${this.sessionDetails.name} one-to-one`

      case 'Group':
        return `Delete ${this.sessionDetails.name} ${this.sessionDetails.number} catch-up`

      default:
        return `Delete ${this.sessionDetails.name}`
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
