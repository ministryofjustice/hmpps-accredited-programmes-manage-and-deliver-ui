import { ProgrammeGroupDetails } from '@manage-and-deliver-api'
import GroupServiceNavigationPresenter, { GroupServiceNavigationPage } from './groupServiceNavigationPresenter'

export default class GroupServiceLayoutPresenter {
  public readonly navigationPresenter: GroupServiceNavigationPresenter

  protected constructor(
    readonly activePage: GroupServiceNavigationPage,
    readonly groupId: string,
    readonly moduleId: string | undefined,
    readonly group?: ProgrammeGroupDetails,
  ) {
    this.navigationPresenter = new GroupServiceNavigationPresenter(groupId, moduleId, activePage)
  }

  get text() {
    return {
      pageHeading: this.group?.group.regionName ?? '',
      pageSubHeading: this.group?.group.code ?? '',
    }
  }
}
