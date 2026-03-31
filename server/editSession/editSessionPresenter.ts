import { GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'
import { TableArgs } from '../utils/govukFrontendTypes'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'
import ViewUtils from '../utils/viewUtils'
import attendanceOptionText, { attendanceOptionTextTags } from '../utils/attendanceUtils'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
    readonly deleteUrl: string,
    readonly successMessage: string | null = null,
    readonly isAttendanceHistory: boolean = false,
    private readonly validationError: FormValidationError | null = null,
    private readonly attendanceHistoryReferralId: string | null = null,
  ) {}

  get text() {
    return {
      pageHeading: `${this.sessionDetails.pageTitle}`,
      pageCaption: `${this.sessionDetails.code}`,
    }
  }

  get canBeDeleted(): boolean {
    return this.sessionDetails.sessionType.toLowerCase() === 'individual'
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
    return PresenterUtils.errorSummary(this.validationError)
  }

  get hasMultipleReferrals() {
    return this.sessionDetails.attendanceAndSessionNotes?.length > 1
  }

  get hasReferral() {
    return this.sessionDetails.attendanceAndSessionNotes?.length > 0
  }

  attendanceOptionText(attendance: string | undefined) {
    return attendanceOptionText(attendance, attendanceOptionTextTags.editSession)
  }

  private get sessionNotesSlug() {
    return convertToUrlFriendlyKebabCase(this.sessionDetails.pageTitle) || 'session'
  }

  private hasSessionNotes(notes: unknown): boolean {
    if (typeof notes !== 'string') {
      return false
    }

    // HTML tags are stripped so validation is based on visible note text only.
    const text = notes.replace(/<[^>]*>/g, '').trim()
    return text.length > 0 && text.toLowerCase() !== 'not added'
  }

  private sessionNotesCell(notes: unknown, referralId: string) {
    if (!this.hasSessionNotes(notes)) {
      return { text: 'Not added' }
    }

    const linkText = `${ViewUtils.escape(this.sessionDetails.pageTitle)} notes`
    return { html: `<a href="${this.sessionNotesPagePath(referralId)}">${linkText}</a>` }
  }

  private sessionNotesPagePath(referralId: string): string {
    return `/group/${this.groupId}/session/${this.sessionId}/${this.sessionNotesSlug}/session-notes?referralId=${encodeURIComponent(referralId)}&source=edit-session`
  }

  get attendanceTableArgs(): MultiSelectTableArgs | TableArgs {
    const attendanceData = this.sessionDetails.attendanceAndSessionNotes || []
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
        headers,
        rows: attendanceData.map((it, index) => ({
          id: `attendance-multi-select-row-${index}`,
          value: it.referralId,
          cells: [
            {
              html: `<a href="/referral-details/${it.referralId}/personal-details">${it.name}</a> ${it.crn}`,
            },
            { html: this.attendanceOptionText(it.attendance).attendanceState },
            this.sessionNotesCell(it.sessionNotes, it.referralId),
          ],
        })),
      }
    }
    return {
      head: headers,
      rows:
        attendanceData.length > 0
          ? [
              [
                {
                  html: `<a href="/referral-details/${attendanceData[0].referralId}/personal-details">${attendanceData[0].name}</a> ${attendanceData[0].crn}`,
                },
                { html: this.attendanceOptionText(attendanceData[0].attendance).attendanceState },
                this.sessionNotesCell(attendanceData[0].sessionNotes, attendanceData[0].referralId),
              ],
            ]
          : [],
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
