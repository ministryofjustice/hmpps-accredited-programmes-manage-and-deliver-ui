import { GroupSessionResponse } from '@manage-and-deliver-api'
import { MultiSelectTableArgs } from '@manage-and-deliver-ui'

export default class EditSessionPresenter {
  constructor(
    readonly groupId: string,
    readonly sessionDetails: GroupSessionResponse,
    readonly sessionId: string,
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

  get attendanceTableArgs(): MultiSelectTableArgs {
    const attendanceData = this.sessionDetails.attendanceAndSessionNotes || []

    return {
      idPrefix: 'attendance-multi-select',
      headers: [
        {
          text: 'Name and CRN',
        },
        {
          text: 'Attendance',
        },
        {
          text: 'Session notes',
        },
      ],
      rows: attendanceData.map((it, index) => ({
        id: `attendance-multi-select-row-${index}`,
        value: it.referralId,
        cells: [
          {
            html: `<a href="/person/${it.crn}">${it.name}</a> ${it.crn}`,
          },
          it.attendance,
          it.sessionNotes,
        ],
      })),
    }
  }
}
