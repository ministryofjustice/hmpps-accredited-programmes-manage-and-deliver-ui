import { Session, EditSessionAttendee } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

export default class EditSessionAttendanceWhoPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionDetails: Session,
    readonly currentlyAttending: EditSessionAttendee,
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.sessionDetails.name}`,
      pageHeadingType: this.sessionDetails.isCatchup ? 'one-to-one catch-up' : 'one-to-one',
      pageCaption: `${this.sessionDetails.referrals[0]?.personName || ''}`,
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

  generateAttendeeRadioOptions(): RadiosArgsItem[] {
    const selectedValue = this.userInputData?.['edit-session-attendance-who'] as string
    if (this.currentlyAttending.referralId && !selectedValue) {
      return this.sessionDetails.referrals.map(referral => ({
        text: `${referral.personName} (${referral.crn})`,
        value: referral.id,
        checked: referral.id === this.currentlyAttending.referralId,
      }))
    }
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
