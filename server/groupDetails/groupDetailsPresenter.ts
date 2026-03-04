import GroupServiceLayoutPresenter, { GroupServiceNavigationValues } from '../shared/groups/groupServiceLayoutPresenter'

export default class GroupDetailsPresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly groupId: string,
    readonly groupCode: string,
  ) {
    super(GroupServiceNavigationValues.groupDetailsTab, groupId)
  }

  get text() {
    return {
      headingText: 'Group details',
      pageSubHeading: this.groupCode,
    }
  }
}
