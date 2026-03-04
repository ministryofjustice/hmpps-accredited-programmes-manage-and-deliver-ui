export enum GroupServiceNavigationValues {
  groupDetailsTab = 'details',
  allocationsTab = 'allocations',
  scheduleOverviewTab = 'scheduleOverview',
  sessionsAndAttendanceTab = 'sessions',
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
      classes: 'group-overview__service-navigation',
      navigation: [
        {
          href: `/group/${this.groupId}/group-details`,
          text: 'Group details',
          active: this.activePage === GroupServiceNavigationValues.groupDetailsTab,
        },
        {
          href: `/group/${this.groupId}/waitlist`,
          text: 'Allocations and waitlist',
          active: this.activePage === GroupServiceNavigationValues.allocationsTab,
        },
        {
          href: `/group/${this.groupId}/schedule-overview`,
          text: 'Schedule overview',
          active: this.activePage === GroupServiceNavigationValues.scheduleOverviewTab,
        },
        {
          href: `/group/${this.groupId}/sessions-and-attendance`,
          text: 'Sessions and attendance',
          active: this.activePage === GroupServiceNavigationValues.sessionsAndAttendanceTab,
        },
      ],
    }
  }
}
