import { GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'
import { TableArgs } from '../utils/govukFrontendTypes'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import DateUtils from '../utils/dateUtils'
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

  private sessionStartDateTime(): Date | null {
    const dateParts = this.sessionDetails.date.trim().split(/\s+/)
    if (dateParts.length < 3) {
      return null
    }

    const day = parseInt(dateParts[dateParts.length - 3], 10)
    const month = DateUtils.monthNameToNumber(dateParts[dateParts.length - 2])
    const year = parseInt(dateParts[dateParts.length - 1], 10)

    if (Number.isNaN(day) || Number.isNaN(year) || month === null) {
      return null
    }

    const rawStartTime = this.sessionDetails.time.split('to')[0].trim().toLowerCase()
    let normalisedStartTime = rawStartTime
    if (rawStartTime === 'midday') {
      normalisedStartTime = '12:00pm'
    } else if (rawStartTime === 'midnight') {
      normalisedStartTime = '12:00am'
    }
    const timeMatch = normalisedStartTime.match(/(\d{1,2})(?::(\d{2}))?\s*([ap]m)/)

    if (!timeMatch) {
      return null
    }

    const rawHours = parseInt(timeMatch[1], 10)
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0
    const hours = (rawHours % 12) + (timeMatch[3] === 'pm' ? 12 : 0)

    if (Number.isNaN(rawHours) || Number.isNaN(minutes)) {
      return null
    }

    const parsed = new Date(year, month, day, hours, minutes, 0, 0)

    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    return parsed
  }

  get canBeDeleted(): boolean {
    // Cant be deleted if its a core group session
    if (this.sessionDetails.sessionType.toUpperCase() === 'GROUP' && this.sessionDetails.isCatchup === false) {
      return false
    }
    // Cant be deleted if its in the past
    if (this.sessionStartDateTime() === null || this.sessionStartDateTime().getTime() < Date.now()) {
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
