import { GroupSessionResponse } from '@manage-and-deliver-api'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
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

  get backLinkArgs() {
    return {
      text: 'Back',
      href: `/group/${this.groupId}/sessions-and-attendance`,
    }
  }
}
