import { AttendanceHistoryResponse, ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../../shared/referral/referralLayoutPresenter'
import { MojAlertComponentArgs } from '../../interfaces/alertComponentArgs'
import { TableArgs } from '../../utils/govukFrontendTypes'
import { attendanceTag, convertToUrlFriendlyKebabCase } from '../../utils/utils'

export default class AttendanceHistoryPresenter extends ReferralLayoutPresenter {
  public readonly personOnProbationName: string

  public readonly currentStatusDescription: string

  constructor(
    readonly referralId: string,
    public readonly attendanceHistory: AttendanceHistoryResponse,
    referralDetails: ReferralDetails,
    readonly successMessage: string | null = null,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.attendanceHistoryTab, referralDetails, isLdcUpdated, isCohortUpdated)
    this.personOnProbationName = referralDetails.personName
    this.currentStatusDescription = referralDetails.currentStatusDescription
  }

  get text() {
    return {
      pageHeading: `Attendance history: ${this.personOnProbationName}`,
      pageCaption: 'Building Choices: moderate intensity',
      tableDescription: this.tableDescription,
    }
  }

  get tableDescription(): string {
    const { popName, currentlyAllocatedGroupCode, attendanceHistory } = this.attendanceHistory
    const hasGroupCode = Boolean(currentlyAllocatedGroupCode)
    const hasSessions = attendanceHistory.length > 0

    const groupLink = hasGroupCode
      ? `<a href="/group/${this.referral.currentlyAllocatedGroupId}/sessions-and-attendance" class="govuk-link">group ${currentlyAllocatedGroupCode} Sessions and attendance</a>`
      : ''

    if (hasGroupCode && hasSessions) {
      return `This is ${popName}'s attendance record and session notes. To see sessions that haven't taken place yet, view ${groupLink}.`
    }

    if (hasGroupCode && !hasSessions) {
      return `${popName} currently has no attendance history. To see sessions that haven't taken place yet, view ${groupLink}.`
    }

    if (!hasGroupCode && hasSessions) {
      return `${popName} is not currently allocated to a group. This is the attendance history for groups they were previously allocated to as part of this referral.`
    }

    return `${popName} is not allocated to a group and has no attendance history connected to this referral.`
  }

  get errorMessageSummary(): MojAlertComponentArgs | null {
    return null
  }

  get successMessageSummary(): MojAlertComponentArgs | null {
    if (!this.successMessage) return null

    return {
      title: 'Referral status updated',
      text: this.successMessage,
      variant: 'success',
      dismissible: true,
      showTitleAsHeading: true,
    }
  }

  get attendanceHistoryTableArgs(): TableArgs['rows'] {
    return this.attendanceHistory.attendanceHistory.map(session => [
      {
        html: `<a href="/group/${session.groupId}/session/${session.sessionId}/edit-session?isAttendanceHistory=true&referralId=${this.referralId}" class="govuk-link">${session.sessionName}</a>`,
      },
      { text: session.groupCode ?? 'N/A' },
      { text: session.date },
      { text: session.time },
      { html: attendanceTag(session.attendanceStatus) },
      session.hasNotes
        ? {
            html: `<a href="${this.sessionNotesPagePath(session.sessionId, session.sessionName, session.groupId)}" class="govuk-link">${session.sessionName} attendance and notes</a>`,
          }
        : { text: 'Not added' },
    ])
  }

  private sessionNotesPagePath(sessionId: string, sessionName: string, groupId: string): string {
    const sessionSlug = convertToUrlFriendlyKebabCase(sessionName) || 'session'
    const query = new URLSearchParams({
      referralId: this.referralId,
      isAttendanceHistory: 'true',
    })

    return `/group/${groupId}/session/${sessionId}/${sessionSlug}/session-notes?${query.toString()}`
  }
}
