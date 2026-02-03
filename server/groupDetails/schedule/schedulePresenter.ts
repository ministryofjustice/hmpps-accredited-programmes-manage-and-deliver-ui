import { GroupSchedule, GroupScheduleSession } from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, {
  GroupServiceNavigationValues,
} from '../../shared/groups/groupServiceLayoutPresenter'

export default class SchedulePresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly groupId: string,
    readonly groupSchedule: GroupSchedule,
  ) {
    super(GroupServiceNavigationValues.scheduleTab, groupId)
  }

  get text() {
    return {
      headingCaptionText: this.groupSchedule.code,
      headingText: `Schedule`,
    }
  }

  get scheduleTableRows() {
    const scheduleRows: (
      | { text: string; attributes?: undefined }
      | { text: string; attributes: { 'data-sort-value': number } }
    )[][] = []
    this.groupSchedule.sessions.forEach((session: GroupScheduleSession) => {
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
