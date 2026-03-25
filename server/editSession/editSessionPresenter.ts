import { GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'
import { TableArgs } from '../utils/govukFrontendTypes'
import attendanceOptionText from '../utils/attendanceUtils'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'
import ViewUtils from '../utils/viewUtils'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
    readonly deleteUrl: string,
    readonly successMessage: string | null = null,
    readonly isAttendanceHistory: boolean = false,
    private readonly validationError: FormValidationError | null = null,
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
        ? `/group/${this.groupId}/attendance-history`
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

  private sessionNotesPagePath(referralId: string) {
    return `/group/${this.groupId}/session/${this.sessionId}/${this.sessionNotesSlug}-session-notes?referralId=${referralId}`
  }

  private get sessionNotesSlug() {
    return convertToUrlFriendlyKebabCase(this.sessionDetails.sessionName)
  }

  private sessionNotesLink(notes: unknown, referralId: string) {
    if (typeof notes !== 'string') {
      return 'Not added'
    }
    const text = notes.replace(/<[^>]*>/g, '').trim()
    if (!text) {
      return 'Not added'
    }

    const linkText = `${ViewUtils.escape(this.sessionDetails.pageTitle)} notes`
    return `<a href="${this.sessionNotesPagePath(referralId)}">${linkText}</a>`
  }

  attendanceOptionText(attendance: string | undefined) {
    return attendanceOptionText(attendance, { attendedLabel: 'Attended - Complied' })
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
            { html: this.sessionNotesLink(it.sessionNotes, it.referralId) },
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
                {
                  html: this.sessionNotesLink(attendanceData[0].sessionNotes, attendanceData[0].referralId),
                },
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
