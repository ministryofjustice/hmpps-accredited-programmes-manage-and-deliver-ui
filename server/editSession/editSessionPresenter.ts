import { GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'
import { TableArgs } from '../utils/govukFrontendTypes'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
    readonly deleteUrl: string,
    readonly successMessage: string | null = null,
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
      text: 'Back',
      href: `/group/${this.groupId}/sessions-and-attendance`,
    }
  }

  get scheduleSessionSuccessMessageArgs(): MojAlertComponentArgs | null {
    if (!this.successMessage) return null

    const isAttendanceUpdateSuccess = this.successMessage.toLowerCase() === 'attendance and session notes updated'
    const referralNames = (this.sessionDetails.attendanceAndSessionNotes ?? []).map(it => it.name).filter(Boolean)

    const messageText =
      isAttendanceUpdateSuccess && referralNames.length
        ? `Attendance recorded for ${this.formatList(referralNames)}.`
        : this.successMessage

    return {
      variant: 'success',
      title: 'Success',
      text: messageText,
      dismissible: true,
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
            it.attendance,
            it.sessionNotes,
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
                { text: attendanceData[0].attendance },
                { text: attendanceData[0].sessionNotes },
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

  private formatList(items: string[]): string {
    if (items.length === 1) {
      return items[0]
    }

    if (items.length === 2) {
      return `${items[0]} and ${items[1]}`
    }

    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
  }
}
