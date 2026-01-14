export type GroupServiceNavigationPage = 'allocations' | 'schedule' | 'sessions' | 'details'

export default class GroupServiceNavigationPresenter {
  constructor(
    private readonly groupId: string,
    private readonly moduleId: string | undefined,
    private readonly activePage: GroupServiceNavigationPage,
  ) {}

  getServiceNavigationArgs(): {
    label: string
    classes: string
    items: { href: string; text: string; active: boolean }[]
  } {
    return {
      label: 'Group service navigation',
      classes: 'group-details__service-navigation',
      items: [
        {
          href: `/group/${this.groupId}/allocations`,
          text: 'Allocations',
          active: this.activePage === 'allocations',
        },
        {
          href: `/group/${this.groupId}/schedule`,
          text: 'Schedule',
          active: this.activePage === 'schedule',
        },
        {
          href: `/group/${this.groupId}/sessions-and-attendance`,
          text: 'Sessions and attendance',
          active: this.activePage === 'sessions',
        },
        {
          href: `/group/${this.groupId}/group-details`,
          text: 'Group details',
          active: this.activePage === 'details',
        },
      ],
    }
  }
}
