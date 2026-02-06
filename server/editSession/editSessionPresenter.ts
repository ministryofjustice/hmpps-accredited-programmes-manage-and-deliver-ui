import { GroupSessionResponse } from '@manage-and-deliver-api'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
    readonly successMessage: string | null = null,
    readonly deleteUrl: string,
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
}
