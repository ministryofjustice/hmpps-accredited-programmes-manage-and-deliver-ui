import { AttendanceAndSessionNotes, GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'
import config from '../config'
import attendanceOptionText, { attendanceOptionTextTags } from '../utils/attendanceUtils'
import { FormValidationError } from '../utils/formValidationError'
import { TableArgs } from '../utils/govukFrontendTypes'
import PresenterUtils from '../utils/presenterUtils'
import { convertToUrlFriendlyKebabCase, getEditSessionRouteTitle } from '../utils/utils'
import ViewUtils from '../utils/viewUtils'

const restrictedAccessBadgeHtml = ' <br><span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
    readonly deleteUrl: string,
    readonly successMessage: string | null = null,
    readonly editSessionSuccessMessage: string | null = null,
    readonly isAttendanceHistory: boolean = false,
    private readonly validationError: FormValidationError | null = null,
    private readonly attendanceHistoryReferralId: string | null = null,
  ) {}

  get pageTitle(): string {
    if (this.isOneToOneSession) {
      return `${this.sessionTitle}`
    }

    return this.sessionDetails.pageTitle
  }

  private get sessionTitle(): string {
    return getEditSessionRouteTitle(this.sessionDetails.pageTitle, this.sessionDetails.sessionType)
  }

  get text() {
    return {
      pageHeading: `${this.sessionDetails.pageTitle}`,
      pageCaption: `${this.sessionDetails.code}`,
    }
  }

  private get isOneToOneSession(): boolean {
    const sessionType = this.sessionDetails.sessionType.toLowerCase()
    return sessionType === 'individual' || sessionType === 'one-to-one' || sessionType === 'one_to_one'
  }

  get canBeDeleted(): boolean {
    // Cant be deleted if its a core group session
    if (this.sessionDetails.sessionType.toUpperCase() === 'GROUP' && this.sessionDetails.isCatchup === false) {
      return false
    }
    // Cant be deleted if end time has passed
    const endDateEpochTime = new Date(this.sessionDetails.unformattedEndDate).getTime()
    if (endDateEpochTime === null || endDateEpochTime <= Date.now()) {
      return false
    }

    // Cant be deleted if it has attendance recorded
    return !this.sessionDetails.attendanceAndSessionNotes?.some(
      attendanceRecord =>
        attendanceRecord.attendance && attendanceRecord.attendance.toLowerCase() !== 'to be confirmed',
    )
  }

  get backLinkArgs() {
    return {
      text: this.isAttendanceHistory ? 'Back to Attendance history' : 'Back to Sessions and attendance',
      href: this.isAttendanceHistory
        ? `/referral/${this.attendanceHistoryReferralId}/attendance-history`
        : `/group/${this.groupId}/sessions-and-attendance`,
    }
  }

  get errorSummary() {
    const summary = PresenterUtils.errorSummary(this.validationError)
    if (!summary) return summary

    const multiSelectError = summary.find(item => item.field === 'multi-select-selected')
    if (multiSelectError) {
      const tableArgs = this.attendanceTableArgs as MultiSelectTableArgs
      const firstRowId = tableArgs.rows?.[0]?.id
      if (firstRowId) {
        // Map to the first checkbox so the error link points to an actual form control
        return summary.map(item =>
          item.field === 'multi-select-selected' ? { ...item, field: `multi-select-${firstRowId}` } : item,
        )
      }
    }

    return summary
  }

  private isExcludedAttendee(it: AttendanceAndSessionNotes): boolean {
    return config.enable_excluded_referrals && Boolean(it.isExcluded)
  }

  // Attendees the current user is authorised to view - shown in the standard attendance table.
  get authorisedAttendees(): AttendanceAndSessionNotes[] {
    return (this.sessionDetails.attendanceAndSessionNotes || []).filter(it => !this.isExcludedAttendee(it))
  }

  // Attendees the current user is not authorised to view - shown, CRN-only, in the Restricted participants table.
  get restrictedAttendees(): AttendanceAndSessionNotes[] {
    return (this.sessionDetails.attendanceAndSessionNotes || [])
      .filter(it => this.isExcludedAttendee(it))
      .sort((a, b) => a.crn.localeCompare(b.crn))
  }

  get hasAnyAttendees(): boolean {
    return (this.sessionDetails.attendanceAndSessionNotes?.length ?? 0) > 0
  }

  get hasRestrictedParticipants(): boolean {
    return this.restrictedAttendees.length > 0
  }

  // "Scheduled to attend" names, with restricted participants shown as CRN-only
  get scheduledToAttendDisplay(): string[] {
    return [...this.authorisedAttendees.map(it => it.name), ...this.restrictedAttendees.map(it => it.crn)]
  }

  get hasMultipleReferrals() {
    return this.authorisedAttendees.length > 1
  }

  get hasReferral() {
    return this.authorisedAttendees.length > 0
  }

  get sessionType() {
    return this.sessionDetails.isCatchup ? 'Catch-up' : this.sessionDetails.sessionType
  }

  attendanceOptionText(attendance: string | undefined) {
    return attendanceOptionText(attendance, attendanceOptionTextTags.editSession)
  }

  private get sessionNotesSlug() {
    const baseSlug = convertToUrlFriendlyKebabCase(this.sessionTitle) || 'session'
    return this.sessionDetails.isCatchup && !baseSlug.endsWith('-catch-up') ? `${baseSlug}-catch-up` : baseSlug
  }

  private hasSessionNotes(notes: unknown): boolean {
    if (typeof notes !== 'string') {
      return false
    }

    // HTML tags are stripped so validation is based on visible note text only.
    const text = notes.replace(/<[^>]*>/g, '').trim()
    return text.length > 0 && text.toLowerCase() !== 'not added'
  }

  private sessionNotesCell(notes: unknown, referralId: string, personName: string) {
    if (!this.hasSessionNotes(notes)) {
      return { text: 'Not added' }
    }

    const linkText = `${personName}: ${ViewUtils.escape(this.sessionTitle)} notes`
    return { html: `<a href="${this.sessionNotesPagePath(referralId)}">${linkText}</a>` }
  }

  private sessionNotesPagePath(referralId: string): string {
    return `/${this.groupId}/${this.sessionId}/${this.sessionNotesSlug}-attendance-and-session-notes?referralId=${encodeURIComponent(referralId)}&source=edit-session`
  }

  private attendeeCells(it: AttendanceAndSessionNotes) {
    const laoBadge = it.lao ? restrictedAccessBadgeHtml : ''
    return [
      { html: `<a href="/referral-details/${it.referralId}/personal-details">${it.name}</a> ${it.crn}${laoBadge}` },
      { html: this.attendanceOptionText(it.attendance).attendanceState },
      this.sessionNotesCell(it.sessionNotes, it.referralId, it.name),
    ]
  }

  get attendanceTableArgs(): MultiSelectTableArgs | TableArgs {
    const attendanceData = this.authorisedAttendees
    const headers = [
      {
        text: 'Name and CRN',
      },
      {
        text: 'Attendance',
      },
      {
        text: 'Session notes',
      },
    ]
    if (this.hasMultipleReferrals) {
      return {
        idPrefix: 'attendance-multi-select',
        caption: 'Attendance record and session notes',
        captionClasses: 'govuk-visually-hidden',
        headers,
        rows: attendanceData.map((it, index) => ({
          id: `attendance-multi-select-row-${index}`,
          value: it.referralId,
          checkBoxLabel: it.name,
          cells: this.attendeeCells(it),
        })),
      }
    }
    return {
      head: headers,
      caption: 'Attendance record and session notes',
      captionClasses: 'govuk-visually-hidden',
      rows: attendanceData.length > 0 ? [this.attendeeCells(attendanceData[0])] : [],
    }
  }

  get attendanceHeading() {
    return {
      text: 'Attendance and session notes',
      classes: 'govuk-heading-m',
    }
  }

  get restrictedParticipantsHeading() {
    return {
      text: 'Restricted participants',
      classes: 'govuk-heading-m',
    }
  }

  get restrictedParticipantsText(): string {
    return 'You cannot add attendance or session notes for restricted access participants.'
  }

  get restrictedParticipantsTableArgs(): TableArgs {
    return {
      head: [{ text: 'CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
      caption: 'Restricted participants',
      captionClasses: 'govuk-visually-hidden',
      rows: this.restrictedAttendees.map(it => [
        { html: `${it.crn}${restrictedAccessBadgeHtml}` },
        { text: 'Restricted' },
        { text: 'Restricted' },
      ]),
    }
  }

  get fields() {
    return {
      'multi-select-selected': {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'multi-select-selected'),
      },
    }
  }
}
