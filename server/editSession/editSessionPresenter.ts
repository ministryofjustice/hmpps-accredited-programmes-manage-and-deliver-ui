import { GroupSessionResponse } from '@manage-and-deliver-api'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly deleteUrl: string,
    readonly successMessage: string | null = null,
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

  get editSessionAttendeesUrl(): string {
    return `/group/${this.groupId}/sessionId/${this.sessionId}/edit-session-attendees`
  }
}
