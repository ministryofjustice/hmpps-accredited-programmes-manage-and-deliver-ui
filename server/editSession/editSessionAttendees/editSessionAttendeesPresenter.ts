import { EditSessionAttendee, EditSessionAttendeesResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { CheckboxesArgsItem, RadiosArgsItem } from '../../utils/govukFrontendTypes'
import config from '../../config'

export default class EditSessionAttendeesPresenter {
  constructor(
    readonly groupId: string,
    readonly backUrl: string,
    readonly sessionAttendees: EditSessionAttendeesResponse,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  private get currentlyAttending(): EditSessionAttendee | null {
    return this.sessionAttendees.attendees.find(attendee => attendee.currentlyAttending) || null
  }

  get pageTitle(): string {
    return 'Edit who should attend the session'
  }

  get text() {
    return {
      headingText: 'Edit who should attend the session',
      pageHeading: `${this.sessionAttendees.sessionName}`,
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
    return this.sortGroupMembersByExcluded().map(attendee => ({
      html: `${this.isExcludedMember(attendee) ? `${attendee.crn}<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span><p>You cannot edit whether a restricted participant should attend the session.</p>` : `${attendee.name} (${attendee.crn})`}`,
      value: attendee.referralId,
      checked: attendee.currentlyAttending === true,
      disabled: this.isExcludedMember(attendee),
    }))
  }

  generateAttendeeCheckboxOptions(): CheckboxesArgsItem[] {
    return this.sortGroupMembersByExcluded().map(attendee => ({
      html: `${this.isExcludedMember(attendee) ? `${attendee.crn}<br/><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span><p>You cannot edit whether a restricted participant should attend the session.</p>` : `${attendee.name} (${attendee.crn})`}`,
      value: `${attendee.referralId} + ${this.isExcludedMember(attendee) ? attendee.crn : attendee.name}`,
      checked: attendee.currentlyAttending === true,
      disabled: this.isExcludedMember(attendee),
    }))
  }

  // Keeps excluded/restricted members visible but always last in the list
  private sortGroupMembersByExcluded() {
    return [...this.sessionAttendees.attendees].sort(
      (a, b) => Number(this.isExcludedMember(a)) - Number(this.isExcludedMember(b)),
    )
  }

  private isExcludedMember(member: EditSessionAttendee): boolean {
    return config.enable_excluded_referrals && member.isExcluded === true
  }

  get isGroupSession(): boolean {
    return this.sessionAttendees.sessionType.toUpperCase() === 'GROUP'
  }

  get fields() {
    return {
      'edit-session-attendees': {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'edit-session-attendees'),
      },
    }
  }
}
