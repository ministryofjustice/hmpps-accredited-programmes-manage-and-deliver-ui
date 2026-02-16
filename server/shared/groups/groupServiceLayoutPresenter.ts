export enum GroupServiceNavigationValues {
  allocationsTab = 'allocations',
  scheduleTab = 'schedule',
  sessionsAndAttendanceTab = 'sessions',
  groupOverviewTab = 'details',
}

export default class GroupServiceLayoutPresenter {
  protected constructor(
    readonly activePage: GroupServiceNavigationValues,
    readonly groupId: string,
  ) {}

  getServiceNavigationArgs(): {
    classes: string
    navigation: { href: string; text: string; active: boolean }[]
  } {
    return {
      classes: 'group-details__service-navigation',
      navigation: [
        {
          href: `/groupOverview/${this.groupId}/waitlist`,
          text: 'Allocations',
          active: this.activePage === GroupServiceNavigationValues.allocationsTab,
        },
        {
          href: `/group/${this.groupId}/schedule`,
          text: 'Schedule',
          active: this.activePage === GroupServiceNavigationValues.scheduleTab,
        },
        {
          href: `/group/${this.groupId}/sessions-and-attendance`,
          text: 'Sessions and attendance',
          active: this.activePage === GroupServiceNavigationValues.sessionsAndAttendanceTab,
        },
        {
          href: `/group/${this.groupId}/group-overview`,
          text: 'Group overview',
          active: this.activePage === GroupServiceNavigationValues.groupOverviewTab,
        },
      ],
    }
  }
}
