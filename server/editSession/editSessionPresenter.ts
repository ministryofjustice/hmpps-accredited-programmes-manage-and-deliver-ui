import { GroupSessionResponse } from '@manage-and-deliver-api'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly deleteUrl: string,
  ) {}

  get text() {
    return {
      pageHeading: `${this.sessionDetails.pageTitle}`,
      pageCaption: `${this.sessionDetails.code}`,
      subHeading: 'Attendance and session notes',
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

  get editSessionAttendanceWhoUrl(): string {
    return `/group/${this.groupId}/sessionId/${this.sessionId}/edit-session-attendees`
  }
}
