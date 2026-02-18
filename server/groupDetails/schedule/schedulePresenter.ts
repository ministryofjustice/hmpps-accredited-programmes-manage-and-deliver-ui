import { GroupScheduleOverview, GroupScheduleSession } from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, {
  GroupServiceNavigationValues,
} from '../../shared/groups/groupServiceLayoutPresenter'

export default class SchedulePresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly groupId: string,
    readonly groupScheduleOverview: GroupScheduleOverview,
  ) {
    super(GroupServiceNavigationValues.scheduleOverviewTab, groupId)
  }

  get text() {
    return {
      headingCaptionText: this.groupScheduleOverview.code,
      headingText: `Schedule overview`,
    }
  }

  get scheduleTableRows() {
    const scheduleRows: (
      | { text: string; attributes?: undefined }
      | { text: string; attributes: { 'data-sort-value': number } }
    )[][] = []
    this.groupScheduleOverview.sessions.forEach((session: GroupScheduleSession) => {
      const date = new Date(session.date).getTime()
      scheduleRows.push([
        {
          text: session.name,
        },
        {
          text: session.type,
        },
        {
          text: session.date,
          attributes: {
            'data-sort-value': date,
          },
        },
        {
          text: session.time,
        },
      ])
    })
    return scheduleRows
  }
}
