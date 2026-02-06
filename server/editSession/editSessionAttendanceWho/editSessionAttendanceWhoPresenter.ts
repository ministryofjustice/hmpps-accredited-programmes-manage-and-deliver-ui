import { Session } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

export default class EditSessionAttendanceWhoPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionDetails: Session,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  //   get text() {
  //     return {
  //       pageCaption: this.generatePageCaption(),
  //     }
  //   }

  //   generatePageCaption() {
  //     switch (this.sessionDetails.type) {
  //       case 'Individual':
  //         if (this.sessionDetails.name === 'Post programme review') {
  //           return `Edit who should attend ${this.sessionDetails.referrals[0].personName}: Post-programme review`
  //         }
  //         if (this.sessionDetails.isCatchup) {
  //           return `Edit who should attend ${this.sessionDetails.referrals[0].personName}: ${this.sessionDetails.name} one-to-one catch-up`
  //         }
  //         return `Edit who should attend ${this.sessionDetails.referrals[0].personName}: ${this.sessionDetails.name} one-to-one`

  //       case 'Group':
  //         return `Edit who should attend ${this.sessionDetails.name} ${this.sessionDetails.number} catch-up`

  //       default:
  //         return `Edit who should attend ${this.sessionDetails.name}`
  //     }
  //   }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.backUrl,
    }
  }

  generateAttendeeRadioOptions(): RadiosArgsItem[] {
    const selectedValue = this.userInputData?.['edit-session-attendance-who'] as string

    return this.sessionDetails.referrals.map(referral => ({
      text: `${referral.personName} (${referral.crn})`,
      value: referral.id,
      checked: selectedValue === referral.id,
    }))
  }

  get fields() {
    return {
      'edit-session-attendance-who': {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-attendance-who'),
      },
    }
  }
}
