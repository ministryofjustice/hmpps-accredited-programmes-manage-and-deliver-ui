import {} from '@manage-and-deliver-api'
import GroupServiceLayoutPresenter, {
  GroupServiceNavigationValues,
} from '../../shared/groups/groupServiceLayoutPresenter'

export default class SchedulePresenter extends GroupServiceLayoutPresenter {
  constructor(readonly groupId: string) {
    super(GroupServiceNavigationValues.scheduleTab, groupId)
  }

  get text() {
    return {
      headingCaptionText: 'TODO',
      headingText: `Sessions and attendance`,
    }
  }
}
