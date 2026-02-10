import { EditSessionAttendee, EditSessionAttendeesResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { RadiosArgsItem } from '../../utils/govukFrontendTypes'

export default class EditSessionAttendeesPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionAttendees: EditSessionAttendeesResponse,
    readonly selectedValue: string | null = null,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  private get currentlyAttending(): EditSessionAttendee | null {
    return this.sessionAttendees.attendees.find(attendee => attendee.currentlyAttending) || null
  }

  private get pageHeadingType(): string {
    if (this.sessionAttendees.sessionType === 'ONE_TO_ONE') {
      return this.sessionAttendees.isCatchup ? 'one-to-one catch-up' : 'one-to-one'
    }
    return 'group'
  }

  get text() {
    return {
      headingText: 'Edit who should attend the session',
      pageHeading: `${this.sessionAttendees.sessionName}`,
      pageHeadingType: this.pageHeadingType,
      pageCaption: this.currentlyAttending.name,
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
    const currentReferralId = this.currentlyAttending?.referralId
    const selectedReferralId = this.selectedValue || currentReferralId

    return this.sessionAttendees.attendees.map(attendee => ({
      text: `${attendee.name} (${attendee.crn})`,
      value: attendee.referralId,
      checked: attendee.referralId === selectedReferralId,
    }))
  }

  get fields() {
    return {
      'edit-session-attendees': {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-attendees'),
      },
    }
  }
}
